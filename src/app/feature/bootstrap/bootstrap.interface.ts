import { Article } from '@wawjs/ngx-horeca';
import { Company } from '../company/company.interface';
import { Discount } from '@wawjs/ngx-horeca';
import { Dish, DishCategory } from '@wawjs/ngx-horeca';
import { EventItem } from '@wawjs/ngx-horeca';
import { Exhibit } from '@wawjs/ngx-horeca';
import { Job } from '@wawjs/ngx-horeca';
import { Profile } from '@wawjs/ngx-horeca';
import { Product } from '@wawjs/ngx-horeca';
import { Question } from '@wawjs/ngx-horeca';
import { Quest } from '@wawjs/ngx-horeca';
import { Review } from '@wawjs/ngx-horeca';
import { Room } from '@wawjs/ngx-horeca';
import { Rule } from '@wawjs/ngx-horeca';

export interface BootstrapData {
	articles?: Partial<Article>[] | null;
	company?: Company;
	categories?: DishCategory[] | null;
	dishes?: Dish[];
	events?: Partial<EventItem>[] | null;
	exhibits?: Partial<Exhibit>[] | null;
	jobs?: Partial<Job>[] | null;
	profiles?: Partial<Profile>[] | null;
	products?: Partial<Product>[] | null;
	questions?: Partial<Question>[] | null;
	quests?: Partial<Quest>[] | null;
	reviews?: Partial<Review>[] | null;
	rooms?: Partial<Room>[] | null;
	rules?: Partial<Rule>[] | null;
	discounts?: Partial<Discount>[] | null;
}
