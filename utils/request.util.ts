import {supabase} from '../supabase/supabase.config';

export async function getPaidRequestsForUser(
  userId: number | undefined,
): Promise<PaidRequest[] | null> {
  try {
    const {data, error} = await supabase
      .from('payment_requests')
      .select(
        `id,created_at,screenshot,from_fullname,from,items(description,price,id),users(image)`,
      )
      .eq('to', userId);
    if (error) throw new Error(error.message);
    return data.map((item: any) => ({
      id: item.id,
      createdAt: item.created_at,
      from: item.from,
      screenshot: item.screenshot,
      from_fullname: item.from_fullname,
      items: item.items,
      users: item.users,
    }));
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteRequest(
  requestId: number,
  currentUserId: number,
  toUserId: number,
  itemId: number,
) {
  try {
    const {error} = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', requestId);
    if (error) throw new Error(error.message);
    const {error: error2} = await supabase.from('notifications').insert([
      {
        to: toUserId,
        from: currentUserId,
        status: 'Payment Request Denied',
        item_id: itemId,
      },
    ]);
    if (error2) throw new Error(error2.message);
    return {
      msg: 'Request deleted successfully',
      status: true,
    };
  } catch (err) {
    console.log(err);
    return {
      msg: 'Request deleted Failed: ' + err,
      status: false,
    };
  }
}
export async function acceptRequest(
  requestId: number,
  currentUserId: number,
  toUserId: number,
  itemId: number,
) {
  try {
    const {error} = await supabase
      .from('user_transactions')
      .delete()
      .eq('user_id', toUserId)
      .eq('item_id', itemId);
    if (error) throw new Error(error.message);

    const {error: error2} = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', requestId);
    if (error2) throw new Error(error2.message);

    const {error: error3} = await supabase.from('notifications').insert([
      {
        to: toUserId,
        from: currentUserId,
        status: 'Payment Request Accepted',
        item_id: itemId,
      },
    ]);
    if (error3) throw new Error(error3.message);

    return {
      msg: 'Request Accepted successfully',
      status: true,
    };
  } catch (err) {
    console.log(err);
    return {
      msg: 'Request Accepted Failed: ' + err,
      status: false,
    };
  }
}
