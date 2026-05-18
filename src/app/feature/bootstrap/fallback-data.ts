import articlesData from '../../../data/articles.json';
import discountsData from '../../../data/discounts.json';
import dishCategoriesData from '../../../data/dishCategories.json';
import dishesData from '../../../data/dishes.json';
import eventsData from '../../../data/events.json';
import exhibitsData from '../../../data/exhibits.json';
import jobsData from '../../../data/jobs.json';
import productsData from '../../../data/products.json';
import profilesData from '../../../data/profiles.json';
import questionsData from '../../../data/question.json';
import questsData from '../../../data/quests.json';
import reviewsData from '../../../data/reviews.json';
import roomsData from '../../../data/rooms.json';
import rulesData from '../../../data/rules.json';
import { Article } from '@wawjs/ngx-horeca';
import { Discount } from '@wawjs/ngx-horeca';
import { Dish, DishCategory } from '@wawjs/ngx-horeca';
import { EventItem } from '@wawjs/ngx-horeca';
import { Exhibit } from '@wawjs/ngx-horeca';
import { Job } from '@wawjs/ngx-horeca';
import { Product } from '@wawjs/ngx-horeca';
import { Profile } from '@wawjs/ngx-horeca';
import { Question } from '@wawjs/ngx-horeca';
import { Quest } from '@wawjs/ngx-horeca';
import { Review } from '@wawjs/ngx-horeca';
import { Room } from '@wawjs/ngx-horeca';
import { Rule } from '@wawjs/ngx-horeca';

interface DishDetail {
	dish: Dish;
	category: DishCategory | null;
}

export const fallbackArticles = articlesData as Article[];
export const fallbackDiscounts = discountsData as Discount[];
export const fallbackDishCategories = dishCategoriesData as DishCategory[];
export const fallbackDishes = (dishesData as Dish[]).map((dish) => ({
	...dish,
	image: dish.image || `/dish/${dish.slug}.webp`,
}));
export const fallbackEvents = eventsData as EventItem[];
export const fallbackExhibits = exhibitsData as Exhibit[];
export const fallbackJobs = jobsData as Job[];
export const fallbackProducts = productsData as Product[];
export const fallbackProfiles = profilesData as Profile[];
export const fallbackQuestions = questionsData as Question[];
export const fallbackQuests = questsData as Quest[];
export const fallbackReviews = reviewsData as Review[];
export const fallbackRooms = roomsData as Room[];
export const fallbackRules = rulesData as Rule[];

export const articleSlugs = fallbackArticles.map((article) => article.slug);
export const discountSlugs = fallbackDiscounts.map((discount) => discount.slug);
export const dishSlugs = fallbackDishes.map((dish) => dish.slug);
export const eventSlugs = fallbackEvents.map((event) => event.slug);
export const jobSlugs = fallbackJobs.map((job) => job.slug);
export const productSlugs = fallbackProducts.map((product) => product.slug);
export const profileSlugs = fallbackProfiles.map((profile) => profile.slug);
export const questSlugs = fallbackQuests.map((quest) => quest.slug);
export const reviewSlugs = fallbackReviews.map((review) => review.slug);
export const roomSlugs = fallbackRooms.map((room) => room.slug);

const _articlesBySlug = new Map(fallbackArticles.map((article) => [article.slug, article]));
const _discountsBySlug = new Map(fallbackDiscounts.map((discount) => [discount.slug, discount]));
const _eventsBySlug = new Map(fallbackEvents.map((event) => [event.slug, event]));
const _jobsBySlug = new Map(fallbackJobs.map((job) => [job.slug, job]));
const _productsBySlug = new Map(fallbackProducts.map((product) => [product.slug, product]));
const _profilesBySlug = new Map(fallbackProfiles.map((profile) => [profile.slug, profile]));
const _questsBySlug = new Map(fallbackQuests.map((quest) => [quest.slug, quest]));
const _reviewsBySlug = new Map(fallbackReviews.map((review) => [review.slug, review]));
const _roomsBySlug = new Map(fallbackRooms.map((room) => [room.slug, room]));
const _categoriesBySlug = new Map(
	fallbackDishCategories.map((category) => [category.slug, category] as const),
);
const _dishDetailsBySlug = new Map(
	fallbackDishes.map((dish) => [
		dish.slug,
		{
			dish,
			category: _categoriesBySlug.get(dish.categorySlug) ?? null,
		} satisfies DishDetail,
	] as const),
);

export const rawDishDetails = [..._dishDetailsBySlug.values()];

export function findFallbackArticleBySlug(slug: string) {
	return _articlesBySlug.get(slug) ?? fallbackArticles[0] ?? null;
}

export function findFallbackDiscountBySlug(slug: string) {
	return _discountsBySlug.get(slug) ?? fallbackDiscounts[0] ?? null;
}

export function findDishDetailBySlug(slug: string) {
	return _dishDetailsBySlug.get(slug) ?? null;
}

export function findFallbackEventBySlug(slug: string) {
	return _eventsBySlug.get(slug) ?? fallbackEvents[0] ?? null;
}

export function findFallbackJobBySlug(slug: string) {
	return _jobsBySlug.get(slug) ?? fallbackJobs[0] ?? null;
}

export function findFallbackProductBySlug(slug: string) {
	return _productsBySlug.get(slug) ?? fallbackProducts[0] ?? null;
}

export function findFallbackProfileBySlug(slug: string) {
	return _profilesBySlug.get(slug) ?? fallbackProfiles[0] ?? null;
}

export function findFallbackQuestBySlug(slug: string) {
	return _questsBySlug.get(slug) ?? fallbackQuests[0] ?? null;
}

export function findFallbackReviewBySlug(slug: string) {
	return _reviewsBySlug.get(slug) ?? fallbackReviews[0] ?? null;
}

export function findFallbackRoomBySlug(slug: string) {
	return _roomsBySlug.get(slug) ?? fallbackRooms[0] ?? null;
}
