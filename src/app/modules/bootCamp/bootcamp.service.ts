import { CoursesModel } from './bootcamp.model';
import { IContent, ICourses, PaginatedCourses } from './bootcamp.interface';

// =================== COURSE SERVICES ===================

/**
 * Create a new course.
 * @param payload - The course data (ICourses).
 * @returns The newly created course document.
 */
const createCourse = async (payload: ICourses) => {
  const course = await CoursesModel.create(payload);
  return course;
};

/**
 * Get all courses.
 * @returns List of all courses.
 */
const getAllCourses = async (
  page: number,
  limit: number
): Promise<PaginatedCourses> => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    CoursesModel.find().skip(skip).limit(limit),
    CoursesModel.countDocuments(),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

/**
 * Get a single course by its ID.
 * @param id - The course ID.
 * @returns The course document if found, otherwise null.
 */
const getCourseById = async (id: string) => {
  return await CoursesModel.findById(id);
};

/**
 * Update a course's name by ID.
 * @param courseId - The course ID.
 * @param name - The new course name.
 * @returns The updated course document.
 */
const updateCourseName = async (courseId: string, name: string) => {
  return await CoursesModel.findByIdAndUpdate(
    courseId,
    { name },
    { new: true }
  );
};

/**
 * Delete a course by ID.
 * @param courseId - The course ID.
 * @returns The deleted course document.
 */
const deleteCourse = async (courseId: string) => {
  return await CoursesModel.findByIdAndDelete(courseId);
};

// =================== MODULE SERVICES ===================

/**
 * Add a new module to a course.
 * @param courseId - The course ID.
 * @param moduleData - The module object to be added.
 * @returns The updated course document with the new module.
 */
const addModuleToCourse = async (courseId: string, moduleData: any) => {
  return await CoursesModel.findByIdAndUpdate(
    courseId,
    { $push: { modules: moduleData } },
    { new: true }
  );
};

/**
 * Update a module's name inside a course.
 * @param courseId - The course ID.
 * @param moduleId - The module ID.
 * @param name - The new module name.
 * @returns The updated course document.
 */
const updateModuleName = async (
  courseId: string,
  moduleId: string,
  name: string
) => {
  return await CoursesModel.findOneAndUpdate(
    { _id: courseId, 'modules._id': moduleId },
    { $set: { 'modules.$.name': name } },
    { new: true }
  );
};

/**
 * Delete a module from a course.
 * @param courseId - The course ID.
 * @param moduleId - The module ID.
 * @returns The updated course document without the deleted module.
 */
const deleteModule = async (courseId: string, moduleId: string) => {
  return await CoursesModel.findByIdAndUpdate(
    courseId,
    { $pull: { modules: { _id: moduleId } } },
    { new: true }
  );
};

// =================== CONTENT SERVICES ===================

/**
 * Add content (video/PDF) to a specific module in a course.
 * @param courseId - The course ID.
 * @param moduleId - The module ID.
 * @param contentData - The content object (video/pdf).
 * @returns The updated course document with new content.
 */
const addContentToModule = async (
  courseId: string,
  moduleId: string,
  contentData: IContent
) => {
  return await CoursesModel.findOneAndUpdate(
    { _id: courseId, 'modules._id': moduleId },
    { $push: { 'modules.$.contents': contentData } },
    { new: true }
  );
};

/**
 * Update the title of a specific content (video/PDF).
 * @param courseId - The course ID.
 * @param moduleId - The module ID.
 * @param contentId - The content ID.
 * @param title - The new content title.
 * @returns The updated course document.
 */
const updateContentTitle = async (
  courseId: string,
  moduleId: string,
  contentId: string,
  title: string
) => {
  return await CoursesModel.findOneAndUpdate(
    {
      _id: courseId,
      'modules._id': moduleId,
      'modules.contents._id': contentId,
    },
    { $set: { 'modules.$[m].contents.$[c].title': title } },
    {
      arrayFilters: [{ 'm._id': moduleId }, { 'c._id': contentId }],
      new: true,
    }
  );
};

/**
 * Delete specific content (video/PDF) from a module.
 * @param courseId - The course ID.
 * @param moduleId - The module ID.
 * @param contentId - The content ID.
 * @returns The updated course document without the deleted content.
 */
const deleteContent = async (
  courseId: string,
  moduleId: string,
  contentId: string
) => {
  return await CoursesModel.findOneAndUpdate(
    { _id: courseId, 'modules._id': moduleId },
    { $pull: { 'modules.$.contents': { _id: contentId } } },
    { new: true }
  );
};

// =================== EXPORT SERVICE ===================

export const CourseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseName,
  deleteCourse,
  addModuleToCourse,
  updateModuleName,
  deleteModule,
  addContentToModule,
  updateContentTitle,
  deleteContent,
};
