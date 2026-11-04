export type Status = 'published' | 'building' | 'planned';
export type Project = {id:string;title:string;description:string;status:Status;thumbnail:string|null;thumbnailAlt:string|null;appUrl:string|null;repoUrl:string|null;articleUrl:string|null;videoUrl:string|null;tags:string[];publishedAt:string|null;updatedAt:string;en?:{title:string;description:string;tags:string[];thumbnailAlt:string|null};verifiedAt?:string};
export type Day = {day:number;date:string;theme:string;meaning:string;idea:string;en?:{meaning:string;idea:string};projects:Project[]};
export type YearData = {year:number;updatedAt:string;days:Day[]};
export type Site = {showPlans:boolean;title:string;tagline:string;description:string;author:{name:string;nameJa:string;initials:string;githubUrl:string};repoUrl:string;officialUrl:string;footer:string;en?:{tagline:string;description:string;footer:string};copyrightStart:number};
export type Years = {defaultYear:number;years:number[]};

export type Language = "en" | "ja";
