export interface Ordenes {
    id: string,
    restaurant_id: string,
    table_number: number,
    total_amount: string,
    order_date: string,
    pre_tax_total: string,
    client_id: string,
    payment_method_id: string,
    payment_method: string,
    post_tax_total: string,
    order_type: string,
    status_id: string,
    status: string,
    created_at: string,
    discount_id: null,
    deleted_at: null
    updated_at: string,
}
