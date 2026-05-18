import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LanguageService, TranslateService } from '@wawjs/ngx-translate';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { companyProfile } from './feature/company/company.data';
import { FooterComponent } from './layouts/footer/footer.component';
import { TopbarComponent } from './layouts/topbar/topbar.component';
import { CanonicalService } from './services/canonical.service';
import { ScrollService } from './services/scroll.service';
import { buildAbsoluteUrl } from './services/seo.utils';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, TopbarComponent, FooterComponent],
	template: '<app-topbar /><div class="pb-24"><router-outlet /></div><app-footer />',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);
	private readonly _document = inject(DOCUMENT);
	private readonly _languageService = inject(LanguageService);
	private readonly _router = inject(Router);
	private readonly _scrollService = inject(ScrollService);
	private readonly _title = inject(Title);
	private readonly _translateService = inject(TranslateService);
	private readonly _navigationEnd = toSignal(
		this._router.events.pipe(filter((event) => event instanceof NavigationEnd)),
		{ initialValue: null },
	);

	constructor() {
		this._canonicalService.initialize();
		this._scrollService.initialize();
		this._setStructuredData();

		effect(() => {
			const language = this._languageService.language();
			const htmlLang =
				environment.languages.find((item) => item.code === language)?.htmlLang ?? language;

			if (htmlLang) {
				this._document.documentElement.lang = htmlLang;
			}
		});

		effect(() => {
			this._navigationEnd();
			this._languageService.language();

			const path = _normalizeTitlePath(this._router.url);

			if (
				path.startsWith('/dish/') ||
				path.startsWith('/discount/') ||
				path.startsWith('/review/') ||
				path.startsWith('/product/')
			) {
				return;
			}

			const titleKey = _pageTitleKeys[path];
			const translatedTitle = titleKey
				? this._translateService.translate(titleKey)()
				: companyProfile.name;

			this._title.setTitle(
				translatedTitle === companyProfile.name
					? translatedTitle
					: `${translatedTitle} | ${companyProfile.name}`,
			);
		});
	}

	private _setStructuredData() {
		const existing = this._document.getElementById(
			'structured-data-local-business',
		) as HTMLScriptElement | null;
		const script = existing ?? this._document.createElement('script');
		const data = companyProfile.structuredData;

		script.id = 'structured-data-local-business';
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify({
			'@context': 'https://schema.org',
			'@type': data.type,
			'@id': `${companyProfile.siteUrl}/#business`,
			name: companyProfile.name,
			url: companyProfile.siteUrl,
			logo: buildAbsoluteUrl(companyProfile.logo),
			image: buildAbsoluteUrl(companyProfile.defaultSeo.image),
			telephone: companyProfile.phone,
			email: companyProfile.email,
			address: {
				'@type': 'PostalAddress',
				streetAddress: companyProfile.address,
				addressLocality: data.addressLocality,
				addressCountry: data.addressCountry,
			},
			priceRange: data.priceRange,
			servesCuisine: data.servesCuisine,
			sameAs: data.sameAs,
		});

		if (!existing) {
			this._document.head.appendChild(script);
		}
	}
}

const _pageTitleKeys: Record<string, string> = {
	'/': 'Wake Cup',
	'/menu': 'Menu',
	'/about': 'About us',
	'/favorites': 'Favorites',
	'/navigation': 'Navigation',
	'/gallery': 'Gallery',
	'/discounts': 'Discounts',
	'/articles': 'Articles',
	'/quests': 'Quests',
	'/reviews': 'Reviews',
	'/events': 'Events',
	'/products': 'Products',
	'/jobs': 'Jobs',
	'/team': 'Team',
	'/socials': 'Socials',
};

function _normalizeTitlePath(url: string): string {
	return (url.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/';
}
