import {supabase} from '../supabase/supabase.config';

export async function getNotifications(
  userId: number | undefined,
): Promise<Notification[] | null> {
  try {
    const {data, error} = await supabase
      .from('notifications')
      .select(
        `id,created_at,status,users(fullName,image),items(description,price)`,
      )
      .eq('to', userId);
    if (error) throw new Error(error.message);
    return data.map((item: any) => ({
      id: item.id,
      createdAt: item.created_at,
      status: item.status,
      items: item.items,
      users: item.users,
    }));
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteNotification(notificationId: number) {
  try {
    const {error} = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    if (error) throw new Error(error.message);

    return {
      msg: 'Notification deleted successfully',
      status: true,
    };
  } catch (err) {
    console.log(err);
    return {
      msg: 'Notification deleted Failed: ' + err,
      status: false,
    };
  }
}
