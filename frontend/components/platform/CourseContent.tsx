'use client'

import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { progressAPI, accountAPI } from '@/lib/api'

interface Lesson {
  id: number
  title: string
  description: string | null
  video_url: string
  video_duration: number | null
}

interface Module {
  id: number
  title: string
  description: string | null
  lessons: Lesson[]
}

interface Course {
  id: number
  title: string
  modules: Module[]
}

interface CourseContentProps {
  course: Course
}

interface LessonProgress {
  [lessonId: number]: {
    watched_duration: number
    is_completed: boolean
  }
}

export default function CourseContent({ course }: CourseContentProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [watchedDuration, setWatchedDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [courseProgress, setCourseProgress] = useState<number>(0)
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({})
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0)
  const [actualVideoDuration, setActualVideoDuration] = useState<number | null>(null)

  useEffect(() => {
    const loadCourseProgress = async () => {
      try {
        const response = await accountAPI.getProgress(course.id)
        if (response.data) {
          setCourseProgress(response.data.progress_percentage || 0)
        }
      } catch (error) {
        console.error('Error loading course progress:', error)
      }
    }
    loadCourseProgress()
  }, [course.id])

  useEffect(() => {
    if (selectedLesson) {
      setLastUpdateTime(0)
      setActualVideoDuration(null) // Reset actual duration when lesson changes
      const loadProgress = async () => {
        try {
          const response = await progressAPI.getLessonProgress(selectedLesson.id)
          if (response.data) {
            const savedProgress = response.data.watched_duration || 0
            setWatchedDuration(savedProgress)
            setIsCompleted(response.data.is_completed || false)
            setLessonProgress(prev => ({
              ...prev,
              [selectedLesson.id]: {
                watched_duration: savedProgress,
                is_completed: response.data.is_completed || false
              }
            }))
          }
        } catch (error) {
          console.error('Error loading progress:', error)
          setWatchedDuration(0)
          setIsCompleted(false)
        }
      }
      loadProgress()
    } else {
      setWatchedDuration(0)
      setIsCompleted(false)
      setLastUpdateTime(0)
    }
  }, [selectedLesson])

  const handleProgress = async (progress: { playedSeconds: number }) => {
    if (!selectedLesson) return

    const currentWatched = Math.floor(progress.playedSeconds)
    const currentTime = Date.now()
    
    const savedProgress = lessonProgress[selectedLesson.id]?.watched_duration || 0
    const maxWatched = Math.max(currentWatched, savedProgress)
    setWatchedDuration(currentWatched)

    if (maxWatched > savedProgress && (currentTime - lastUpdateTime) >= 5000) {
      try {
        const duration = actualVideoDuration || selectedLesson.video_duration
        const isLessonCompleted = duration 
          ? maxWatched >= (duration * 0.9)
          : false
        await progressAPI.updateProgress({
          lesson_id: selectedLesson.id,
          watched_duration: maxWatched,
          is_completed: isLessonCompleted,
        })
        if (isLessonCompleted) {
          setIsCompleted(true)
        }
        setLessonProgress(prev => ({
          ...prev,
          [selectedLesson.id]: {
            watched_duration: maxWatched,
            is_completed: isLessonCompleted
          }
        }))
        setLastUpdateTime(currentTime)
        const progressResponse = await accountAPI.getProgress(course.id)
        if (progressResponse.data) {
          setCourseProgress(progressResponse.data.progress_percentage || 0)
        }
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
  }

  const formatTime = (seconds: number | null | undefined) => {
    if (!seconds || seconds < 0) return '0:00'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Use actual video duration from player if available, otherwise use DB value
  const videoDuration = actualVideoDuration || selectedLesson?.video_duration || null
  
  const savedLessonProgress = selectedLesson ? (lessonProgress[selectedLesson.id]?.watched_duration || 0) : 0
  const effectiveViewed = selectedLesson && videoDuration != null
    ? Math.min(videoDuration, Math.max(savedLessonProgress, watchedDuration))
    : Math.max(savedLessonProgress, watchedDuration)
  const lessonProgressPercent = selectedLesson && videoDuration
    ? Math.min(100, (effectiveViewed / videoDuration) * 100)
    : 0

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-white">Course Progress</h3>
          <span className="text-xs sm:text-sm font-bold text-red-400">{Math.min(100, courseProgress).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 sm:h-3 mb-2">
          <div
            className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, courseProgress)}%` }}
          />
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Lessons watched: {Math.round((Math.min(100, courseProgress) / 100) * totalLessons)} of {totalLessons}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-slate-800 rounded-lg shadow-md p-3 sm:p-4 border border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Course Content</h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="border-b border-slate-700 pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2 text-slate-300">{module.title}</h3>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const progress = lessonProgress[lesson.id]
                      const lessonDuration = lesson.video_duration
                      const lessonPercent = lessonDuration && progress
                        ? Math.min(100, (progress.watched_duration / lessonDuration) * 100)
                        : 0
                      const isLessonDone = progress?.is_completed || false
                      
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left px-3 py-2 rounded transition-colors relative ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm truncate">{lesson.title}</span>
                              {isLessonDone && (
                                <span className="text-green-400 ml-2 flex-shrink-0">✓</span>
                              )}
                            </div>
                            {progress && lessonPercent > 0 && (
                              <div className="mt-1 w-full bg-slate-600 rounded-full h-1">
                                <div
                                  className="bg-red-500 h-1 rounded-full"
                                  style={{ width: `${lessonPercent}%` }}
                                />
                              </div>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          {selectedLesson ? (
            <div className="bg-slate-800 rounded-lg shadow-md p-3 sm:p-4 border border-slate-700">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{selectedLesson.title}</h2>
              {selectedLesson.description && (
                <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">{selectedLesson.description}</p>
              )}
              
              {videoDuration && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-slate-400">Lesson Progress</span>
                    <span className="text-xs sm:text-sm font-bold text-red-400">{lessonProgressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lessonProgressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Watched: {formatTime(effectiveViewed)} / {formatTime(videoDuration)}
                  </p>
                </div>
              )}
              
              <div className="aspect-video mb-3 sm:mb-4 bg-black rounded-lg overflow-hidden">
                <ReactPlayer
                  url={selectedLesson.video_url}
                  width="100%"
                  height="100%"
                  controls
                  onProgress={handleProgress}
                  progressInterval={1000}
                  onDuration={(duration) => {
                    // Get actual video duration from player
                    if (duration && duration > 0) {
                      setActualVideoDuration(Math.floor(duration))
                    }
                  }}
                  onEnded={async () => {
                    if (selectedLesson) {
                      const finalDuration = actualVideoDuration || selectedLesson.video_duration
                      if (!finalDuration) return
                      try {
                        await progressAPI.updateProgress({
                          lesson_id: selectedLesson.id,
                          watched_duration: finalDuration,
                          is_completed: true,
                        })
                        setIsCompleted(true)
                        setLessonProgress(prev => ({
                          ...prev,
                          [selectedLesson.id]: {
                            watched_duration: finalDuration,
                            is_completed: true
                          }
                        }))
                        const progressResponse = await accountAPI.getProgress(course.id)
                        if (progressResponse.data) {
                          setCourseProgress(progressResponse.data.progress_percentage || 0)
                        }
                      } catch (error) {
                        console.error('Error updating progress on video end:', error)
                      }
                    }
                  }}
                  config={{
                    youtube: {
                      playerVars: { 
                        modestbranding: 1, 
                        rel: 0,
                        controls: 1,
                      },
                    },
                    file: {
                      attributes: {
                        controlsList: 'nodownload'
                      }
                    }
                  }}
                />
              </div>
              
              {isCompleted && (
                <div className="bg-green-900/50 border border-green-500 text-green-200 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
                  ✓ Lesson completed
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg shadow-md p-6 sm:p-8 text-center border border-slate-700">
              <p className="text-slate-300 text-sm sm:text-base">Select a lesson to watch</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
