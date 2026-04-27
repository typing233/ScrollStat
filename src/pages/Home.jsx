import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { storage } from '../data/storage'
import { createSampleStory } from '../data/sampleData'

function Home() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    const existingStories = storage.getStories()
    
    if (existingStories.length === 0) {
      const sampleStory = createSampleStory()
      storage.saveStories([sampleStory])
      setStories([sampleStory])
    } else {
      setStories(existingStories)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              用数据讲述精彩故事
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10">
              ScrollStat 让您通过滚动叙事的方式，将数据可视化与故事内容完美结合
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
              >
                开始创作
              </Link>
              {stories.length > 0 && (
                <Link
                  to={`/story/${stories[0].id}`}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition-all transform hover:scale-105"
                >
                  体验示例
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              核心功能
            </h2>
            <p className="text-xl text-gray-600">
              打造沉浸式数据叙事体验
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: '丰富图表支持',
                description: '支持柱状图、折线图、散点图等多种图表类型，满足各类数据可视化需求'
              },
              {
                icon: '📜',
                title: '滚动叙事',
                description: '图表随滚动进度平滑过渡动画，让数据讲述跟随阅读节奏自然展开'
              },
              {
                icon: '🔀',
                title: '剧情岔路口',
                description: '在关键节点提供选择分支，读者可根据兴趣探索不同的数据维度和故事走向'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {stories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                探索数据故事
              </h2>
              <p className="text-xl text-gray-600">
                点击进入沉浸式数据叙事体验
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/story/${story.id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {story.description || '暂无描述'}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(story.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                        <span className="text-blue-600 text-sm font-medium flex items-center">
                          开始阅读
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
