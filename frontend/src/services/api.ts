import { supabase } from './supabaseClient';

// Helper to parse paths and extract table names
// e.g. "/employees" -> "employees"
// e.g. "/employees/12" -> "employees", id = 12
function parsePath(url: string) {
  const cleanUrl = url.replace(/^\/+/, '').split('?')[0]; // remove leading slash, ignore query params
  const parts = cleanUrl.split('/');
  const table = parts[0];
  const id = parts[1] ? parseInt(parts[1], 10) : undefined;
  
  // Map frontend resource paths to Supabase database table names
  let tableName = table;
  if (table === 'core-engagements') tableName = 'core_engagements';
  if (table === 'whatsapp-engagements') tableName = 'whatsapp_engagements';
  if (table === 'school-community') tableName = 'school_communities';
  if (table === 'core-team-formation') tableName = 'core_team_formations';

  return { tableName, id };
}

// Automatically serialize arrays/objects to JSON strings for Supabase TEXT columns
function serializePayload(payload: any) {
  if (!payload) return payload;
  const cleanPayload = { ...payload };
  for (const key in cleanPayload) {
    if (cleanPayload[key] !== null && typeof cleanPayload[key] === 'object') {
      cleanPayload[key] = JSON.stringify(cleanPayload[key]);
    }
  }
  return cleanPayload;
}

// Automatically deserialize JSON strings to arrays/objects for the frontend
function parseRow(row: any) {
  if (!row) return row;
  const parsed = { ...row };
  const jsonFields = [
    'proof_files',
    'alumni_group_platforms',
    'core_team_platforms',
    'history_json'
  ];
  jsonFields.forEach((field) => {
    if (typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e) {
        // Leave as string if not parseable
      }
    }
  });
  return parsed;
}

// Database Seeding Logic inside Frontend client
async function seedDatabaseInSupabase(): Promise<boolean> {
  console.log('Starting Supabase database clear and seed...');
  try {
    // 1. Wipe existing data from all tables
    const tables = [
      'attendance',
      'employees',
      'core_engagements',
      'whatsapp_engagements',
      'school_communities',
      'core_team_formations'
    ];

    for (const table of tables) {
      console.log(`Clearing table: ${table}`);
      const { error } = await supabase.from(table).delete().neq('id', -1); // delete all where id != -1
      if (error) {
        console.error(`Error clearing table ${table}:`, error.message);
        return false;
      }
    }

    // 2. Insert mock Employees
    const employees = [
      {
        name: 'State Admin',
        email: 'admin@gmail.com',
        contact: '9876543210',
        department: 'Management',
        role: 'Admin',
        joining_date: '2026-06-01'
      },
      {
        name: 'Manager User',
        email: 'manager@gmail.com',
        contact: '9876543211',
        department: 'Operations',
        role: 'Manager',
        joining_date: '2026-06-01'
      },
      {
        name: 'Employee User',
        email: 'employee@gmail.com',
        contact: '9876543212',
        department: 'Field Operations',
        role: 'Employee',
        joining_date: '2026-06-01'
      }
    ];
    const { error: empError } = await supabase.from('employees').insert(employees);
    if (empError) throw new Error(empError.message);

    // 3. Insert mock Attendance
    const attendance = [
      {
        employee_name: 'State Admin',
        check_in: '2026-06-05 09:00:00',
        check_out: '2026-06-05 18:00:00',
        work_done: 'Conducted planning and state level reviews.'
      },
      {
        employee_name: 'Manager User',
        check_in: '2026-06-05 09:30:00',
        check_out: '2026-06-05 17:30:00',
        work_done: 'Field coordination and school visits.'
      },
      {
        employee_name: 'Employee User',
        check_in: '2026-06-05 09:15:00',
        check_out: '2026-06-05 18:15:00',
        work_done: 'WhatsApp group engagement updates and support.'
      }
    ];
    const { error: attError } = await supabase.from('attendance').insert(attendance);
    if (attError) throw new Error(attError.message);

    // 4. Insert mock WhatsApp Group Engagements
    const whatsapp = [
      {
        school_name: 'Govt Hr Sec School, Madurai',
        district: 'Madurai',
        block: 'Madurai East',
        school_type: 'High Sec School',
        school_category: 'Centinary School',
        group_formed: 'Yes',
        group_link: 'https://chat.whatsapp.com/GHSSAlumniMadurai2025',
        member_count: 245,
        last_shared_message: 'Invitation for centenary fundraising meeting on June 15th.',
        last_shared_message_date: '2026-06-01',
        last_msg_responses: '12 members clicked join, 5 sent RSVPs directly.',
        activity_status: 'High',
        changes_count: 0,
        history_json: '[]',
        entered_by: 'Admin',
        entered_time: '2026-06-01, 10:00:00 AM'
      },
      {
        school_name: "St. Mary's School, Trichy",
        district: 'Tiruchirappalli',
        block: 'Thiruverumbur',
        school_type: 'Middle School',
        school_category: 'Vetri Palligal School',
        group_formed: 'Yes',
        group_link: 'https://chat.whatsapp.com/StMarysAlumniTrichy',
        member_count: 480,
        last_shared_message: 'Announced the new SMC mentoring session timetable.',
        last_shared_message_date: '2026-06-02',
        last_msg_responses: '22 members confirmed availability, 2 asked for rescheduling.',
        activity_status: 'High',
        changes_count: 0,
        history_json: '[]',
        entered_by: 'Manager',
        entered_time: '2026-06-02, 11:30:00 AM'
      },
      {
        school_name: 'Municipal Boys High School, Salem',
        district: 'Salem',
        block: 'Salem South',
        school_type: 'High School',
        school_category: 'Career Guidance',
        group_formed: 'No',
        group_link: 'https://chat.whatsapp.com/SalemBoysHighAlumni',
        member_count: 0,
        last_shared_message: 'N/A - Group is being set up',
        last_shared_message_date: '2026-06-03',
        last_msg_responses: 'N/A',
        activity_status: 'Low',
        changes_count: 0,
        history_json: '[]',
        entered_by: 'Karthik',
        entered_time: '2026-06-03, 04:15:00 PM'
      }
    ];
    const { error: waError } = await supabase.from('whatsapp_engagements').insert(whatsapp.map(serializePayload));
    if (waError) throw new Error(waError.message);

    // 5. Insert mock Core Engagements
    const core = [
      {
        district: 'Madurai',
        block: 'Madurai East',
        school_name: 'Govt Hr Sec School, Madurai',
        school_type: 'High Sec School',
        school_category: 'Centinary School',
        engagement_type: 'Alumni Meet',
        alumni_count: 45,
        amount_collected: 25000,
        proof_files: '[]',
        important_attendees: 'District Collector, School Headmaster, SMC President',
        remarks: 'Discussed centenary celebration funding and sports ground expansion plans.',
        entered_by: 'Admin',
        entered_time: '2026-06-01, 10:00:00 AM'
      },
      {
        district: 'Tiruchirappalli',
        block: 'Thiruverumbur',
        school_name: "St. Joseph's Middle School",
        school_type: 'Middle School',
        school_category: 'Vetri Palligal School',
        engagement_type: 'Career Guidance Session',
        alumni_count: 12,
        amount_collected: 0,
        proof_files: '[]',
        important_attendees: 'IT Professional Alumni Lead, local teachers',
        remarks: 'Interactive guidance on computer science careers for 8th-grade students.',
        entered_by: 'Manager',
        entered_time: '2026-06-02, 11:30:00 AM'
      },
      {
        district: 'Salem',
        block: 'Salem South',
        school_name: 'Municipal Boys High School',
        school_type: 'High School',
        school_category: 'Career Guidance',
        engagement_type: 'Others',
        alumni_count: 30,
        amount_collected: 120000,
        proof_files: '[]',
        important_attendees: 'Alumni Association President, local business sponsors',
        remarks: 'Raised funds to upgrade classroom projectors and install high-speed internet.',
        entered_by: 'Karthik',
        entered_time: '2026-06-03, 04:15:00 PM'
      }
    ];
    const { error: coreError } = await supabase.from('core_engagements').insert(core.map(serializePayload));
    if (coreError) throw new Error(coreError.message);

    // 6. Insert mock School Communities
    const schoolComm = [
      {
        district: 'Madurai',
        block: 'Madurai East',
        school_name: 'Govt Hr Sec School, Madurai',
        school_type: 'High Sec School',
        school_category: 'Centinary School',
        hm_supportive: 'Yes',
        smc_alumni_count: 15,
        ambassador_alumni_count: 5,
        approach_taken: 'Direct HM visit',
        period_started: '2026-05-01',
        period_ended: '2026-05-15',
        mobilized_count: 650,
        mobilized_status: 'Yes',
        alumni_group_platforms: ['WhatsApp', 'Telegram'],
        other_platform: '',
        platform_link: 'https://chat.whatsapp.com/GHSSAlumni2025',
        risk_challenge: 'Coordination with remote alumni',
        mitigation_taken: 'Assigned block leaders',
        take_back: 'Need regular updates',
        proof_files: [],
        media_content: 'Inaugural event photos',
        celebrated_status: 'Yes',
        entered_by: 'State Admin',
        entered_time: '2026-06-01, 10:00:00 AM'
      },
      {
        district: 'Tiruchirappalli',
        block: 'Thiruverumbur',
        school_name: "St. Joseph's Middle School",
        school_type: 'Middle School',
        school_category: 'Vetri Palligal School',
        hm_supportive: 'No',
        smc_alumni_count: 8,
        ambassador_alumni_count: 2,
        approach_taken: 'Organized Meet - Hm',
        period_started: '2026-05-10',
        period_ended: '2026-05-20',
        mobilized_count: 420,
        mobilized_status: 'No',
        alumni_group_platforms: ['Facebook'],
        other_platform: '',
        platform_link: 'https://facebook.com/groups/stjosephalumni',
        risk_challenge: 'HM supportive attitude was lacking initially',
        mitigation_taken: 'Addressed HM concerns during SMC meet',
        take_back: 'Persistence is key',
        proof_files: [],
        media_content: 'SMC meeting photos',
        celebrated_status: 'No',
        entered_by: 'Manager',
        entered_time: '2026-06-02, 11:30:00 AM'
      }
    ];
    const { error: scError } = await supabase.from('school_communities').insert(schoolComm.map(serializePayload));
    if (scError) throw new Error(scError.message);

    // 7. Insert mock Core Team Formations
    const coreTeam = [
      {
        district: 'Madurai',
        block: 'Madurai East',
        school_name: 'Govt Hr Sec School, Madurai',
        school_type: 'High Sec School',
        school_category: 'Centinary School',
        hm_supportive: 'Yes',
        smc_alumni_support: 'Yes',
        ambassador_alumni_support: 'Yes',
        approach_taken: 'Core group meeting',
        period_started: '2026-05-15',
        period_ended: '2026-05-30',
        core_team_count: 28,
        core_team_status: 'Formed',
        core_team_platforms: ['WhatsApp', 'Telegram'],
        other_platform: '',
        platform_link: 'https://chat.whatsapp.com/sample-core-team',
        risk_challenge: 'Busy schedules',
        mitigation_taken: 'Weekend virtual syncs',
        take_back: 'Excited lead organizers',
        proof_files: [],
        media_content: '',
        celebrated_status: 'Yes',
        entered_by: 'State Admin',
        entered_time: '2026-06-01, 10:00:00 AM'
      },
      {
        district: 'Tiruchirappalli',
        block: 'Thiruverumbur',
        school_name: "St. Joseph's Middle School",
        school_type: 'Middle School',
        school_category: 'Vetri Palligal School',
        hm_supportive: 'No',
        smc_alumni_support: 'Yes',
        ambassador_alumni_support: 'No',
        approach_taken: 'Phone campaigning',
        period_started: '2026-05-20',
        period_ended: '2026-06-01',
        core_team_count: 10,
        core_team_status: 'Not Formed',
        core_team_platforms: ['WhatsApp'],
        other_platform: '',
        platform_link: '',
        risk_challenge: 'HM hesitant to host meetups',
        mitigation_taken: 'SMC President hosted meetups',
        take_back: 'Strong local lead alumni',
        proof_files: [],
        media_content: '',
        celebrated_status: 'No',
        entered_by: 'Manager',
        entered_time: '2026-06-02, 11:30:00 AM'
      }
    ];
    const { error: ctfError } = await supabase.from('core_team_formations').insert(coreTeam.map(serializePayload));
    if (ctfError) throw new Error(ctfError.message);

    console.log('Database re-seeded successfully.');
    return true;
  } catch (err) {
    console.error('Error seeding database:', err);
    return false;
  }
}

// Emulate axios client interface mapping to direct Supabase calls
const api = {
  async get(url: string, config?: any) {
    const { tableName, id } = parsePath(url);
    
    let query = supabase.from(tableName).select('*');
    
    if (id !== undefined) {
      query = query.eq('id', id);
    }
    
    // Check config for query params (e.g. config.params)
    // Also parse query parameters from the url string directly
    const urlParts = url.split('?');
    const searchParams = new URLSearchParams(urlParts[1] || '');
    const params = {
      ...config?.params,
      ...Object.fromEntries(searchParams.entries())
    };
    
    if (params.district) {
      query = query.eq('district', params.district);
    }
    if (params.block) {
      query = query.eq('block', params.block);
    }
    if (params.school_name) {
      query = query.ilike('school_name', `%${params.school_name}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error(`Supabase GET error on ${tableName}:`, error.message);
      throw new Error(error.message);
    }

    const parsedData = (data || []).map(parseRow);

    // Emulate FastAPI response wrapping structure:
    // - /attendance API endpoint returned {"data": [...]}
    if (tableName === 'attendance' && id === undefined) {
      return { data: { data: parsedData } };
    }
    
    // If getting single record
    if (id !== undefined) {
      return { data: parsedData[0] };
    }
    
    return { data: parsedData };
  },

  async post(url: string, payload?: any, _config?: any) {
    const { tableName } = parsePath(url);
    
    // Special Database Reset route handler
    if (tableName === 'db' && url.includes('reset')) {
      const success = await seedDatabaseInSupabase();
      if (!success) throw new Error("Failed to reset and seed Supabase database.");
      return { data: { status: 'success', message: 'Database reset and seeded successfully' } };
    }

    const serialized = serializePayload(payload);
    const { data, error } = await supabase
      .from(tableName)
      .insert([serialized])
      .select();
      
    if (error) {
      console.error(`Supabase POST error on ${tableName}:`, error.message);
      throw new Error(error.message);
    }
    
    return { data: parseRow(data?.[0]) };
  },

  async put(url: string, payload: any, _config?: any) {
    const { tableName, id } = parsePath(url);
    if (id === undefined) throw new Error("ID required for PUT request");

    const serialized = serializePayload(payload);
    const { data, error } = await supabase
      .from(tableName)
      .update(serialized)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Supabase PUT error on ${tableName}:`, error.message);
      throw new Error(error.message);
    }
    
    return { data: parseRow(data?.[0]) };
  },

  async delete(url: string, _config?: any) {
    const { tableName, id } = parsePath(url);
    if (id === undefined) throw new Error("ID required for DELETE request");

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Supabase DELETE error on ${tableName}:`, error.message);
      throw new Error(error.message);
    }
    
    return { data: { message: `${tableName} deleted` } };
  }

};

export default api;
export { seedDatabaseInSupabase };