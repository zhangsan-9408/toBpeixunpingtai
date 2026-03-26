<template>
  <div class="admin-courses">
    <div class="header">
      <h1>课程管理</h1>
      <button class="btn-primary" @click="showCreateModal = true">+ 新建课程</button>
    </div>
    
    <div class="course-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>课程名称</th>
            <th>分类</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.title }}</td>
            <td>{{ course.category_name || '-' }}</td>
            <td>
              <span :class="['status', course.status]">{{ getStatusText(course.status) }}</span>
            </td>
            <td>{{ formatDate(course.created_at) }}</td>
            <td>
              <button class="btn-small" @click="editCourse(course)">编辑</button>
              <button class="btn-small danger" @click="deleteCourse(course.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 新建课程弹窗 -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h2>新建课程</h2>
        <form @submit.prevent="handleCreate">
          <div class="form-item">
            <label>课程名称</label>
            <input v-model="form.title" required />
          </div>
          <div class="form-item">
            <label>课程描述</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false">取消</button>
            <button type="submit" class="btn-primary">创建</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCourses, createCourse } from '../../api/courses'

const courses = ref([])
const showCreateModal = ref(false)
const form = ref({
  title: '',
  description: ''
})

const statusTexts = {
  draft: '草稿',
  published: '已发布',
  archived: '已归档'
}

const getStatusText = (status) => statusTexts[status] || status

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const fetchCourses = async () => {
  try {
    const data = await getCourses({ limit: 100 })
    courses.value = data.list || []
  } catch (error) {
    console.error('获取课程失败:', error)
  }
}

const handleCreate = async () => {
  try {
    await createCourse(form.value)
    showCreateModal.value = false
    form.value = { title: '', description: '' }
    fetchCourses()
  } catch (error) {
    console.error('创建课程失败:', error)
  }
}

const editCourse = (course) => {
  alert('编辑功能开发中...')
}

const deleteCourse = (id) => {
  if (confirm('确定要删除这个课程吗？')) {
    alert('删除功能开发中...')
  }
}

onMounted(fetchCourses)
</script>

<style scoped>
.admin-courses {
  max-width: 1200px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  color: #333;
}

.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.course-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
}

.status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.status.draft {
  background: #fff3cd;
  color: #856404;
}

.status.published {
  background: #d4edda;
  color: #155724;
}

.btn-small {
  padding: 6px 12px;
  margin-right: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.btn-small.danger {
  border-color: #dc3545;
  color: #dc3545;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 24px;
  color: #333;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
}

.form-actions button:not(.btn-primary) {
  border: 1px solid #ddd;
  background: white;
}
</style>
