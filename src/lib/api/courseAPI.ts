
import { supabase } from '../supabase';
import { Course, Module } from './types';

// Function to fetch all courses
export const getCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select();

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    return data as Course[];
  } catch (error) {
    console.error('Exception in getCourses:', error);
    return [];
  }
};

// Function to fetch a single course by ID
export const getCourseById = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select()
      .eq('id', courseId)
      .single();

    if (error) {
      console.error(`Error fetching course ${courseId}:`, error);
      throw error;
    }

    return data as Course;
  } catch (error) {
    console.error(`Exception in getCourseById for ${courseId}:`, error);
    return null;
  }
};

// Function to fetch all modules for a course
export const getModulesByCourseId = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select()
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      console.error(`Error fetching modules for course ${courseId}:`, error);
      throw error;
    }

    return data as Module[];
  } catch (error) {
    console.error(`Exception in getModulesByCourseId for ${courseId}:`, error);
    return [];
  }
};

// Function to fetch a single module by ID
export const getModuleById = async (moduleId: string) => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select()
      .eq('id', moduleId)
      .single();

    if (error) {
      console.error(`Error fetching module ${moduleId}:`, error);
      throw error;
    }

    return data as Module;
  } catch (error) {
    console.error(`Exception in getModuleById for ${moduleId}:`, error);
    return null;
  }
};
