import { createClient } from './client';

export const db = {
  // ─────────────────────────────────────────
  // Ensure user row exists in public.users
  // (guards against FK failure for users who
  //  signed up before the trigger was installed)
  // ─────────────────────────────────────────
  async ensureProfile(userId: string, email: string, name: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .upsert(
        { id: userId, email, name },
        { onConflict: 'id', ignoreDuplicates: true }
      );
    if (error) console.warn('ensureProfile warning:', error.message);
  },

  // ─────────────────────────────────────────
  // Users / Profiles
  // ─────────────────────────────────────────
  async getProfile(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, profile: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('users')
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ─────────────────────────────────────────
  // Resume Image (uploaded files)
  // ─────────────────────────────────────────
  async getResumes(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_image')
      .select(`
        id,
        file_name,
        selected_role,
        created_at,
        analysis:analysis_results(
          id, 
          overall_score,
          keyword_score,
          format_score,
          structure_score,
          skills_score,
          ats_score
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async saveResume(resume: {
    user_id: string;
    user_name: string;
    user_email: string;
    file_name: string;
    file_url?: string;
    file_content?: string;
    selected_role: string;
    is_custom_role?: boolean;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_image')
      .insert([{ file_url: '', ...resume }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteResume(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('resume_image')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // ─────────────────────────────────────────
  // Analysis Results
  // ─────────────────────────────────────────
  async getAnalysisById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async saveAnalysis(analysis: {
    resume_id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    keyword_score?: number;
    format_score?: number;
    structure_score?: number;
    skills_score?: number;
    ats_score?: number;
    overall_score?: number;
    keyword_details?: any;
    format_details?: any;
    structure_details?: any;
    skills_details?: any;
    ats_details?: any;
    suggestions?: any;
  }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('analysis_results')
      .insert([analysis])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ─────────────────────────────────────────
  // Delete all user data
  // ─────────────────────────────────────────
  async deleteUserData(userId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  },
};
