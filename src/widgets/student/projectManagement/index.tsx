"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as _ from './style';
import { 
  getTasks, 
  getTeamMembers, 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask,
  urgeTask,
  Task, 
  TeamMember, 
  TaskStatus, 
  TaskCategory 
} from '@/shared/api/tasks';
import { showToast } from '@/shared/ui/toast';
import Dashboard from '@/widgets/student/dashboard';

type DragItem = {
  taskId: number;
  fromStatus: TaskStatus;
};

type ViewMode = 'board' | 'dashboard';

export default function ProjectManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    assigneeId: null as number | null,
    title: '',
    category: 'FRONTEND' as TaskCategory,
    deadline: '',
    status: 'TODO' as TaskStatus,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksData, membersData] = await Promise.all([
        getTasks(),
        getTeamMembers(),
      ]);
      setTasks(tasksData);
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        assigneeId: task.assignee?.id || null,
        title: task.title,
        category: task.category,
        deadline: task.deadline,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setFormData({
        assigneeId: null,
        title: '',
        category: 'FRONTEND',
        deadline: '',
        status: 'TODO',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      showToast.error('작업 제목을 입력해주세요.');
      return;
    }
    if (!formData.deadline) {
      showToast.error('마감일을 선택해주세요.');
      return;
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
        showToast.success('작업이 수정되었습니다.');
      } else {
        await createTask({
          assigneeId: formData.assigneeId,
          title: formData.title,
          category: formData.category,
          deadline: formData.deadline,
        });
        showToast.success('작업이 생성되었습니다.');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save task:', error);
      showToast.error('작업 저장에 실패했습니다.');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast.error('상태 변경에 실패했습니다.');
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number, status: TaskStatus) => {
    setDraggedItem({ taskId, fromStatus: status });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    if (draggedItem.fromStatus === targetStatus) {
      setDraggedItem(null);
      return;
    }

    try {
      await updateTaskStatus(draggedItem.taskId, { status: targetStatus });
      showToast.success('작업이 이동되었습니다.');
      fetchData();
    } catch (error) {
      console.error('Failed to move task:', error);
      showToast.error('작업 이동에 실패했습니다.');
    } finally {
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteTask(taskId);
      showToast.success('작업이 삭제되었습니다.');
      fetchData();
    } catch (error) {
      console.error('Failed to delete task:', error);
      showToast.error('작업 삭제에 실패했습니다.');
    }
  };

  const handleUrge = async (taskId: number) => {
    if (!confirm('담당자에게 독촉 이메일을 전송하시겠습니까?')) return;

    try {
      await urgeTask(taskId);
      showToast.success('독촉 이메일이 전송되었습니다.');
    } catch (error: any) {
      console.error('Failed to urge task:', error);
      const errorMessage = error.response?.data?.message || '독촉 이메일 전송에 실패했습니다.';
      showToast.error(errorMessage);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getCategoryColor = (category: TaskCategory) => {
    const colors = {
      FRONTEND: '#FF9B62',
      BACKEND: '#FFD6D6',
      DESIGN: '#FFB88C',
      AI: '#FFC9A6',
    };
    return colors[category];
  };

  const getCategoryLabel = (category: TaskCategory) => {
    const labels = {
      FRONTEND: '프론트엔드',
      BACKEND: '백엔드',
      DESIGN: '디자인',
      AI: 'AI',
    };
    return labels[category];
  };

  return (
    <_.Container>
      <_.Header>
        <_.Title>프로젝트 관리</_.Title>
        <_.ButtonGroup>
          <_.ViewToggle>
            <_.ViewButton isActive={viewMode === 'dashboard'} onClick={() => setViewMode('dashboard')}>
              대시보드
            </_.ViewButton>
            <_.ViewButton isActive={viewMode === 'board'} onClick={() => setViewMode('board')}>
              보드
            </_.ViewButton>
          </_.ViewToggle>
          {viewMode === 'board' && (
            <_.AddButton onClick={() => handleOpenModal()}>
              <Image src="/assets/plus.svg" alt="추가" width={16} height={16} />
              작업 추가
            </_.AddButton>
          )}
        </_.ButtonGroup>
      </_.Header>

      {viewMode === 'dashboard' ? (
        <Dashboard />
      ) : (
        <_.BoardContainer>
        {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
          <_.Column 
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, status)}
          >
            <_.ColumnHeader status={status}>
              <_.ColumnTitle>
                {status === 'TODO' ? '시작 전' : status === 'IN_PROGRESS' ? '진행 중' : '완료'}
              </_.ColumnTitle>
              <_.TaskCount>{getTasksByStatus(status).length}</_.TaskCount>
            </_.ColumnHeader>

            <_.TaskList>
              {getTasksByStatus(status).map((task) => (
                <_.TaskCard 
                  key={task.id}
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task.id, status)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItem?.taskId === task.id}
                >
                  <_.TaskHeader>
                    <_.CategoryBadge color={getCategoryColor(task.category)}>
                      {getCategoryLabel(task.category)}
                    </_.CategoryBadge>
                    <_.TaskActions>
                      <_.ActionButton onClick={() => handleOpenModal(task)}>
                        수정
                      </_.ActionButton>
                      <_.ActionButton onClick={() => handleDelete(task.id)}>
                        삭제
                      </_.ActionButton>
                      <_.ActionButton onClick={() => handleUrge(task.id)}>
                        독촉
                      </_.ActionButton>
                    </_.TaskActions>
                  </_.TaskHeader>

                  <_.TaskTitle>{task.title}</_.TaskTitle>

                  <_.TaskInfo>
                    <_.InfoItem>
                      <_.InfoLabel>담당자:</_.InfoLabel>
                      <_.InfoValue>{task.assignee?.name || '미지정'}</_.InfoValue>
                    </_.InfoItem>
                    <_.InfoItem>
                      <_.InfoLabel>마감일:</_.InfoLabel>
                      <_.InfoValue>{task.deadline}</_.InfoValue>
                    </_.InfoItem>
                  </_.TaskInfo>
                </_.TaskCard>
              ))}
            </_.TaskList>
          </_.Column>
        ))}
      </_.BoardContainer>
      )}

      {isModalOpen && (
        <_.ModalOverlay onClick={handleCloseModal}>
          <_.ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <_.ModalHeader>
              <_.ModalTitle>{editingTask ? '작업 수정' : '작업 추가'}</_.ModalTitle>
              <_.CloseButton onClick={handleCloseModal}>×</_.CloseButton>
            </_.ModalHeader>

            <_.FormGroup>
              <_.Label>작업 제목</_.Label>
              <_.Input
                type="text"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                placeholder="작업 제목을 입력하세요"
              />
            </_.FormGroup>

            <_.FormGroup>
              <_.Label>담당자</_.Label>
              <_.Select
                value={formData.assigneeId || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, assigneeId: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">미지정</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </_.Select>
            </_.FormGroup>

            <_.FormGroup>
              <_.Label>분야</_.Label>
              <_.Select
                value={formData.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
              >
                <option value="FRONTEND">프론트엔드</option>
                <option value="BACKEND">백엔드</option>
                <option value="DESIGN">디자인</option>
                <option value="AI">AI</option>
              </_.Select>
            </_.FormGroup>

            {editingTask && (
              <_.FormGroup>
                <_.Label>상태</_.Label>
                <_.Select
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                >
                  <option value="TODO">시작 전</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="DONE">완료</option>
                </_.Select>
              </_.FormGroup>
            )}

            <_.FormGroup>
              <_.Label>마감일</_.Label>
              <_.Input
                type="date"
                value={formData.deadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </_.FormGroup>

            <_.ModalActions>
              <_.CancelButton onClick={handleCloseModal}>취소</_.CancelButton>
              <_.SubmitButton onClick={handleSubmit}>
                {editingTask ? '수정' : '생성'}
              </_.SubmitButton>
            </_.ModalActions>
          </_.ModalContent>
        </_.ModalOverlay>
      )}
    </_.Container>
  );
}
