import React, { useState } from 'react';
import {
  Plus,
  Video,
  FileText,
  Users,
  BookOpen,
  CheckCircle2,
  Eye,
  FolderPlus,
} from 'lucide-react';
import {
  ASSETS,
  CareermizePackage,
  Course,
  Lesson,
} from '../data/careermizeData';

interface InstructorStudioViewProps {
  courses: Course[];
  packages: CareermizePackage[];
  onCreateCourse: (newCourse: Course) => void;
  onAddLessonToCourse: (courseId: string, chapterId: string, lesson: Lesson) => void;
  onToggleCourseStatus: (courseId: string) => void;
  onOpenCourseInLms: (courseId: string) => void;
}

export const InstructorStudioView: React.FC<InstructorStudioViewProps> = ({
  courses,
  packages,
  onCreateCourse,
  onAddLessonToCourse,
  onToggleCourseStatus,
  onOpenCourseInLms,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'create-course' | 'add-lesson'>(
    'overview'
  );

  // New Course Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [category, setCategory] = useState<Course['category']>('Digital Marketing');
  const [level, setLevel] = useState<Course['level']>('Intermediate');
  const [durationHours, setDurationHours] = useState('12.5');
  const [price, setPrice] = useState('2499');
  const [mrp, setMrp] = useState('4999');
  const [packageTierId, setPackageTierId] = useState('pkg-pro');
  const [seoTitle, setSeoTitle] = useState('');
  const [firstChapterTitle, setFirstChapterTitle] = useState(
    'Chapter 1: Core Frameworks & Execution'
  );
  const [firstLessonTitle, setFirstLessonTitle] = useState(
    '01. System Architecture & Practical Setup'
  );
  const [firstLessonDuration, setFirstLessonDuration] = useState('21:30');
  const [createdBanner, setCreatedBanner] = useState<string | null>(null);

  // Add Lesson to Existing Course State
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || 'crs-meta-ads');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('18:45');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonPreview, setLessonPreview] = useState(true);
  const [pdfResourceName, setPdfResourceName] = useState('Practical Execution Checklist.pdf');

  const totalLearners = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const totalLessonsCount = courses.reduce(
    (sum, c) => sum + c.chapters.reduce((s, ch) => s + ch.lessons.length, 0),
    0
  );

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) return;

    const newId = `crs-custom-${Date.now()}`;
    const newCourse: Course = {
      id: newId,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: title.trim(),
      shortDescription: shortDesc.trim(),
      description: shortDesc.trim(),
      category,
      subCategory: 'Specialized Track',
      language: 'Hindi & English',
      level,
      durationHours: Number(durationHours) || 10,
      price: Number(price) || 1999,
      mrp: Number(mrp) || 3999,
      instructorId: 'inst-1',
      instructorName: 'Vikramaditya Rathore',
      instructorTitle: 'Principal Architect & Lead Mentor',
      enrollmentCount: 1,
      rating: 5.0,
      reviewCount: 1,
      certificateEligible: true,
      status: 'Published',
      packageTierId,
      coverType: category === 'Finance & Equity' ? 'finance' : 'marketing',
      seoTitle: seoTitle.trim() || `${title.trim()} | Careermize`,
      seoKeywords: `${category.toLowerCase()}, careermize course`,
      assignmentPrompt: `Complete the practical capstone project for ${title.trim()} and submit your documentation.`,
      chapters: [
        {
          id: `ch-${Date.now()}`,
          title: firstChapterTitle,
          description: 'Practical implementation lessons and downloadable templates.',
          sortOrder: 1,
          isPublished: true,
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: firstLessonTitle,
              duration: firstLessonDuration,
              durationMinutes: 21,
              description: shortDesc.trim(),
              isFreePreview: true,
              isPublished: true,
              sortOrder: 1,
              videoResolution: '1080p Signed HLS',
              signedStreamId: `cm-stream-${Date.now()}-signed`,
              keyTakeaways: [
                'Follow the structured step-by-step SOP worksheet attached in resources.',
                'Complete the end-of-module assessment to unlock your QR certificate.',
              ],
              resources: [
                {
                  id: `res-${Date.now()}`,
                  title: 'Course Master Playbook & SOP.pdf',
                  type: 'PDF',
                  size: '1.6 MB',
                  url: '#download-sop',
                },
              ],
            },
          ],
        },
      ],
      quiz: [
        {
          id: `q-${Date.now()}`,
          question: `What is the primary execution principle taught in ${title.trim()}?`,
          options: [
            'Data-backed testing and measurable unit economics',
            'Guesswork without tracking',
            'Skipping customer validation',
            'None of the above',
          ],
          correctIndex: 0,
          explanation: 'Every Careermize module prioritizes measurable unit economics and real execution.',
        },
      ],
      reviews: [],
    };

    onCreateCourse(newCourse);
    setCreatedBanner(`Published new course "${newCourse.title}" into the live catalog!`);
    setTitle('');
    setShortDesc('');
    setActiveTab('overview');
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;
    const targetCourse = courses.find((c) => c.id === targetCourseId);
    if (!targetCourse || !targetCourse.chapters[0]) return;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: lessonTitle.trim(),
      duration: lessonDuration,
      durationMinutes: 19,
      description: lessonDesc.trim() || 'Practical step-by-step video walkthrough.',
      isFreePreview: lessonPreview,
      isPublished: true,
      sortOrder: targetCourse.chapters[0].lessons.length + 1,
      videoResolution: '1080p Signed HLS',
      signedStreamId: `cm-stream-${Date.now()}`,
      keyTakeaways: [
        'Apply the framework directly to your live project workspace.',
      ],
      resources: pdfResourceName.trim()
        ? [
            {
              id: `res-${Date.now()}`,
              title: pdfResourceName.trim(),
              type: 'PDF',
              size: '1.2 MB',
              url: '#download-pdf',
            },
          ]
        : [],
    };

    onAddLessonToCourse(targetCourse.id, targetCourse.chapters[0].id, newLesson);
    setCreatedBanner(
      `Added lesson "${newLesson.title}" (${newLesson.duration}) to ${targetCourse.title}.`
    );
    setLessonTitle('');
    setLessonDesc('');
    setActiveTab('overview');
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 px-6 py-8">
      {/* Instructor Identity Header */}
      <div className="flex flex-col justify-between gap-6 rounded-xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <img
            src={ASSETS.avatarInstructorImg}
            alt="Vikramaditya Rathore"
            referrerPolicy="no-referrer"
            className="h-14 w-14 rounded-full object-cover border border-slate-300"
          />
          <div>
            <p className="text-xs font-medium text-sky-700">
              Careermize Instructor Studio · Verified Faculty
            </p>
            <h1 className="font-display text-2xl font-semibold text-slate-900">
              Vikramaditya Rathore — Curriculum & LMS Studio
            </h1>
            <p className="text-xs text-slate-500">
              Ex-Growth Lead · Principal Architect · Managing {courses.length} Live Courses
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Courses & Analytics
          </button>
          <button
            onClick={() => setActiveTab('create-course')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'create-course'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Create New Course
          </button>
          <button
            onClick={() => setActiveTab('add-lesson')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'add-lesson'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Upload Video Lesson / PDF
          </button>
        </div>
      </div>

      {createdBanner && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900">
          ✓ {createdBanner}
        </div>
      )}

      {/* Instructor KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Published Courses & Lessons</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {courses.length} Courses · {totalLessonsCount} Lessons
          </p>
          <p className="mt-1 text-xs text-slate-500">Hierarchical LMS Structure</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Student Enrollments</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-sky-700 tabular-nums">
            {totalLearners.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">Across All 6 Skill Bundles</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Average Course Rating</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
            4.9 / 5.0
          </p>
          <p className="mt-1 text-xs text-slate-500">Based on 6,195 Verified Reviews</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Instructor Royalty Earnings</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            ₹8,42,500
          </p>
          <p className="mt-1 text-xs text-slate-500">15% Royalty Pool · Settled Monthly</p>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & COURSE TABLE */}
      {activeTab === 'overview' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <th className="py-3.5 px-4">Course Title & Slug</th>
                <th className="py-3.5 px-4">Category & Level</th>
                <th className="py-3.5 px-4 text-right">Chapters / Lessons</th>
                <th className="py-3.5 px-4 text-right">Enrollments</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {courses.map((course) => {
                const lessonCount = course.chapters.reduce(
                  (s, ch) => s + ch.lessons.length,
                  0
                );
                return (
                  <tr key={course.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{course.title}</p>
                      <p className="font-mono text-[11px] text-slate-400">/{course.slug}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {course.category} · {course.level}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums">
                      {course.chapters.length} Ch · {lessonCount} Lessons ({course.durationHours}h)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {course.enrollmentCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold">
                      {course.status === 'Published' ? (
                        <span className="text-emerald-700">● Published</span>
                      ) : (
                        <span className="text-amber-600">▲ Draft</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onToggleCourseStatus(course.id)}
                          className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => onOpenCourseInLms(course.id)}
                          className="rounded bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                        >
                          Inspect Player
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CREATE NEW HIERARCHICAL COURSE */}
      {activeTab === 'create-course' && (
        <form
          onSubmit={handleCreateCourseSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 space-y-5"
        >
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Create New Course (Course → Chapter → Lesson Hierarchy)
            </h2>
            <p className="text-xs text-slate-500">
              New courses are immediately added to the selected Careermize Bundle and LMS Player.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700">Course Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., LinkedIn B2B Outbound & Cold Email Mastery"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Finance & Equity">Finance & Equity</option>
                <option value="Full-Stack & AI">Full-Stack & AI</option>
                <option value="Communication & Soft Skills">Communication & Soft Skills</option>
                <option value="Creator & Freelancing">Creator & Freelancing</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700">
                Course Description & Outcome *
              </label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Concise summary of practical skills and deliverables..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Standalone Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Assign to Package Bundle
              </label>
              <select
                value={packageTierId}
                onChange={(e) => setPackageTierId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Initial Chapter Title
              </label>
              <input
                type="text"
                value={firstChapterTitle}
                onChange={(e) => setFirstChapterTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                First Video Lesson Title
              </label>
              <input
                type="text"
                value={firstLessonTitle}
                onChange={(e) => setFirstLessonTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Video Duration (MM:SS)
              </label>
              <input
                type="text"
                value={firstLessonDuration}
                onChange={(e) => setFirstLessonDuration(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#0284C7] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1]"
          >
            Publish Course to Careermize Catalog
          </button>
        </form>
      )}

      {/* TAB 3: ADD LESSON / UPLOAD SIGNED VIDEO TO EXISTING COURSE */}
      {activeTab === 'add-lesson' && (
        <form
          onSubmit={handleAddLessonSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 space-y-5"
        >
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Upload Signed HLS Video Lesson & PDF Worksheet
            </h2>
            <p className="text-xs text-slate-500">
              Append a new video lesson with DRM signed stream protection to any existing course.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">Select Target Course</label>
              <select
                value={targetCourseId}
                onChange={(e) => setTargetCourseId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Lesson Title *</label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="e.g., 05. Retargeting Funnel & WhatsApp Automation"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Video Duration (MM:SS)
              </label>
              <input
                type="text"
                value={lessonDuration}
                onChange={(e) => setLessonDuration(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Attach Downloadable PDF Resource
              </label>
              <input
                type="text"
                value={pdfResourceName}
                onChange={(e) => setPdfResourceName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700">
                Lesson Description
              </label>
              <input
                type="text"
                value={lessonDesc}
                onChange={(e) => setLessonDesc(e.target.value)}
                placeholder="What will students execute in this lesson?"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="freePreviewCheck"
                checked={lessonPreview}
                onChange={(e) => setLessonPreview(e.target.checked)}
              />
              <label htmlFor="freePreviewCheck" className="text-xs text-slate-700">
                Unlock as Free Public Preview Lesson
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Add Lesson to Course Curriculum
          </button>
        </form>
      )}
    </div>
  );
};
