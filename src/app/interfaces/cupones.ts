export interface Cupon {
    id: number;
    code: string;
    description: string;
    discount_type: string;
    value: number;
    start_date: string;
    active: boolean;
    end_date: string;
}
