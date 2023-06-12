export interface LoginType {
    email: string;
    password: string;
}

export interface SignUpType {
    id?: string
    email: string;
    password?:string;
    first_name: string;
    last_name: string;
    username: string;
}

export interface OrderType {
    [key: string]: any;
    id: string;
    name: string;
    price: string;
}

export interface ShelfType {
    [key: string]: any;
    id: string;
    title: string;
    bookId: BookType;
    userId: UserType;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface CategoryType {
    [key: string]: any;
    id: string;
    name: string;
    description: string;
}
export interface BookToShelfType {
    [key: string]: any;
    bookId: string;
    shelfId: string;
}

export interface UserType {
    [key: string]: any;
    id: string
    firstName: string
    lastName: string
}