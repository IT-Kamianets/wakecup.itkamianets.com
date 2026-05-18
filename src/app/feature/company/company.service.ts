import { Injectable, signal } from '@angular/core';
import { Company, CompanyProfile } from './company.interface';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	readonly company = signal<CompanyProfile | null>(null);

	setFallbackCompany(company: CompanyProfile) {
		this.company.set(company);
	}

	setCompany(company: Partial<Company> | null | undefined) {
		if (!company) {
			return;
		}

		this.company.update((currentCompany) => {
			if (!currentCompany) {
				return company as CompanyProfile;
			}

			return {
				...currentCompany,
				_id: _stringOrFallback(company._id, currentCompany._id),
				name: _stringOrFallback(company.name, currentCompany.name),
			};
		});
	}
}

function _stringOrFallback(value: string | null | undefined, fallback: string): string {
	return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}
