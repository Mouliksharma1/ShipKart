'use server';

import { globalAdminSearch } from '@/lib/services/admin/search.service';

export async function globalSearchAction(query: string) {
  try {
    const results = await globalAdminSearch(query);
    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message, results: [] };
  }
}
