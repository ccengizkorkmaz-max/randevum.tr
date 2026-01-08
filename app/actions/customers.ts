'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCustomers(query?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    let queryBuilder = supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

    if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder

    if (error) {
        console.error('Error fetching customers:', error)
        throw new Error('Failed to fetch customers')
    }

    return data
}

export async function getCustomerById(id: string) {
    const supabase = await createClient()

    // Also fetch their appointment history
    const { data, error } = await supabase
        .from('customers')
        .select(`
            *,
            appointments (
                id,
                start_time,
                status,
                services (title, price, currency)
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching customer:', error)
        throw new Error('Failed to fetch customer')
    }

    return data
}

export async function createCustomer(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const notes = formData.get('notes') as string

    const { data, error } = await supabase
        .from('customers')
        .insert({
            user_id: user.id,
            name,
            phone,
            email,
            notes
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating customer:', error)
        throw new Error('Failed to create customer')
    }

    revalidatePath('/customers')
    return { success: true, customer: data }
}

export async function updateCustomer(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const notes = formData.get('notes') as string

    const { error } = await supabase
        .from('customers')
        .update({
            name,
            phone,
            email,
            notes,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating customer:', error)
        throw new Error('Failed to update customer')
    }

    revalidatePath(`/customers/${id}`)
    revalidatePath('/customers')
    return { success: true }
}
