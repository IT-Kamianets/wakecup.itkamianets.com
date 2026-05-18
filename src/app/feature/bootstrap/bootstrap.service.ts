import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, TransferState } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ArticleService } from '@wawjs/ngx-horeca';
import { CompanyService } from '../company/company.service';
import { DiscountService } from '@wawjs/ngx-horeca';
import { DishCategoryService } from '@wawjs/ngx-horeca';
import { DishService } from '@wawjs/ngx-horeca';
import { EventService } from '@wawjs/ngx-horeca';
import { ExhibitService } from '@wawjs/ngx-horeca';
import { JobService } from '@wawjs/ngx-horeca';
import { ProfileService } from '@wawjs/ngx-horeca';
import { ProductService } from '@wawjs/ngx-horeca';
import { QuestionService } from '@wawjs/ngx-horeca';
import { QuestService } from '@wawjs/ngx-horeca';
import { ReviewService } from '@wawjs/ngx-horeca';
import { RoomService } from '@wawjs/ngx-horeca';
import { RuleService } from '@wawjs/ngx-horeca';
import { BOOTSTRAP_STATE_KEY } from './bootstrap.const';
import {
	fallbackArticles,
	fallbackDiscounts,
	fallbackDishCategories,
	fallbackDishes,
	fallbackEvents,
	fallbackExhibits,
	fallbackJobs,
	fallbackProducts,
	fallbackProfiles,
	fallbackQuestions,
	fallbackQuests,
	fallbackReviews,
	fallbackRooms,
	fallbackRules,
} from './fallback-data';
import { BootstrapData } from './bootstrap.interface';
import { companyProfile } from '../company/company.data';

@Injectable({
	providedIn: 'root',
})
export class BootstrapService {
	private _platformId = inject(PLATFORM_ID);
	private _transferState = inject(TransferState);
	private _articleService = inject(ArticleService);
	private _companyService = inject(CompanyService);
	private _dishCategoryService = inject(DishCategoryService);
	private _dishService = inject(DishService);
	private _eventService = inject(EventService);
	private _exhibitService = inject(ExhibitService);
	private _jobService = inject(JobService);
	private _profileService = inject(ProfileService);
	private _productService = inject(ProductService);
	private _questionService = inject(QuestionService);
	private _questService = inject(QuestService);
	private _reviewService = inject(ReviewService);
	private _roomService = inject(RoomService);
	private _ruleService = inject(RuleService);
	private _discountService = inject(DiscountService);
	private _fallbackDataApplied = false;

	async initialize() {
		this._applyFallbackData();

		const transferData = this._transferState.get<BootstrapData | null>(
			BOOTSTRAP_STATE_KEY,
			null,
		);

		if (transferData) {
			this._apply(transferData);

			if (isPlatformBrowser(this._platformId)) {
				this._transferState.remove(BOOTSTRAP_STATE_KEY);
				void this._refreshInBrowser();
			}

			return;
		}

		if (isPlatformServer(this._platformId)) {
			const data = await this._load();

			if (data) {
				this._transferState.set(BOOTSTRAP_STATE_KEY, data);
				this._apply(data);
			} else {
				this._articleService.finishLoading();
				this._eventService.finishLoading();
				this._exhibitService.finishLoading();
				this._jobService.finishLoading();
				this._productService.finishLoading();
				this._questionService.finishLoading();
				this._questService.finishLoading();
				this._reviewService.finishLoading();
				this._roomService.finishLoading();
				this._ruleService.finishLoading();
				this._discountService.finishLoading();
			}

			return;
		}

		void this._refreshInBrowser();
	}

	private _apply(data: BootstrapData) {
		this._articleService.resolveArticles(data.articles);

		if (data.company) {
			this._companyService.setCompany(data.company);
		}

		this._dishCategoryService.setCategories(data.categories);

		this._dishService.resolveDishes(data.dishes);

		this._eventService.resolveEvents(data.events);
		this._exhibitService.resolveExhibits(data.exhibits);
		this._jobService.resolveJobs(data.jobs);
		this._profileService.setProfiles(data.profiles);
		this._productService.resolveProducts(data.products);
		this._questionService.resolveQuestions(data.questions);
		this._questService.resolveQuests(data.quests);
		this._reviewService.resolveReviews(data.reviews);
		this._roomService.resolveRooms(data.rooms);
		this._ruleService.resolveRules(data.rules);
		this._discountService.resolveDiscounts(data.discounts);
	}

	private _applyFallbackData() {
		if (this._fallbackDataApplied) {
			return;
		}

		this._fallbackDataApplied = true;
		this._articleService.setFallbackArticles(fallbackArticles);
		this._companyService.setFallbackCompany(companyProfile);
		this._dishCategoryService.setFallbackCategories(fallbackDishCategories);
		this._dishService.setFallbackDishes(fallbackDishes);
		this._eventService.setFallbackEvents(fallbackEvents);
		this._exhibitService.setFallbackExhibits(fallbackExhibits);
		this._jobService.setFallbackJobs(fallbackJobs);
		this._profileService.setFallbackProfiles(fallbackProfiles);
		this._productService.setFallbackProducts(fallbackProducts);
		this._questionService.setFallbackQuestions(fallbackQuestions);
		this._questService.setFallbackQuests(fallbackQuests);
		this._reviewService.setFallbackReviews(fallbackReviews);
		this._roomService.setFallbackRooms(fallbackRooms);
		this._ruleService.setFallbackRules(fallbackRules);
		this._discountService.setFallbackDiscounts(fallbackDiscounts);
	}

	private async _refreshInBrowser() {
		const data = await this._load();

		if (data) {
			this._apply(data);
			return;
		}

		this._articleService.finishLoading();
		this._eventService.finishLoading();
		this._exhibitService.finishLoading();
		this._jobService.finishLoading();
		this._productService.finishLoading();
		this._questionService.finishLoading();
		this._questService.finishLoading();
		this._reviewService.finishLoading();
		this._roomService.finishLoading();
		this._ruleService.finishLoading();
		this._discountService.finishLoading();
	}

	private async _load() {
		try {
			const response = await fetch(
				`${environment.apiUrl}/api/bootstrap/${environment.companyId}`,
			);

			if (!response.ok) {
				return null;
			}

			return (await response.json()) as BootstrapData;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
