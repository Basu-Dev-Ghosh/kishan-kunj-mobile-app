import {supabase} from '../supabase/supabase.config';

export async function getUsers(): Promise<User[] | null> {
  try {
    const {data, error} = await supabase
      .from('users')
      .select('id,email,fullName,displayName,department,image,ispresent');
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: {session},
      error: sessionError,
    } = await supabase?.auth?.getSession();
    if (sessionError) throw new Error(sessionError.message);
    if (!session) throw new Error('No session found');
    const {data, error} = await supabase
      .from('users')
      .select('id,email,fullName,displayName,department,image,ispresent')
      .eq('email', session?.user?.email);
    if (error) throw new Error(error.message);
    return data?.[0] as User;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

export async function updatePresentToDB(value: boolean, email: string) {
  try {
    const {data, error} = await supabase
      .from('users')
      .update({ispresent: value})
      .eq('email', email);
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
export async function updateUserImageToDB(value: string, email: string) {
  try {
    const {data, error} = await supabase
      .from('users')
      .update({image: value})
      .eq('email', email);
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
