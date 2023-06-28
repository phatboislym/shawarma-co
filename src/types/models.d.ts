export interface LoginType {
    username: string;
    password: string;
}

export interface SignUpType {
    // id?: string
    email: string;
    password:string;
    name: string;
    username: string;
}

export interface OrderType {
    [key: string]: any;
    id_?: any;
    // name: string;
    quantity: string;
    status: any;
    // order_date: Date;
    size: string;
    spicyness: any;
}

export interface UserType {
    [key: string]: any;
    id: string
    username: string
    full_name: string
    is_staff: boolean;
}

export interface PaginationProps {
	total: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (item: number) => void;
}

export interface TableProps {
	headers: { field: string; use: string; use_in_search?: boolean }[];
	onSorting: (key: string, order: string) => void;
}