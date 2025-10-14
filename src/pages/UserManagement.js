import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/UseHttp';
import HttpForm from '../components/forms/HttpForm';
import DataTable from '../components/forms/DataTable';

// 사용자 관리 페이지 예시
const UserManagement = React.memo(function UserManagement() {
  const { loading, error, get, post, put, delete: del } = useHttp();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // 사용자 목록 조회
  const fetchUsers = async () => {
    try {
      const result = await get('/api/users');
      setUsers(result || []);
    } catch (err) {
      console.error('사용자 목록 조회 실패:', err);
    }
  };

  // 사용자 생성
  const handleCreateUser = async (userData) => {
    try {
      const newUser = await post('/api/users', userData);
      setUsers(prev => [...prev, newUser]);
      alert('사용자가 생성되었습니다.');
    } catch (err) {
      console.error('사용자 생성 실패:', err);
      alert('사용자 생성에 실패했습니다.');
    }
  };

  // 사용자 수정
  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await put(`/api/users/${editingUser.id}`, userData);
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      alert('사용자가 수정되었습니다.');
    } catch (err) {
      console.error('사용자 수정 실패:', err);
      alert('사용자 수정에 실패했습니다.');
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (user, index) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return;
    }

    try {
      await del(`/api/users/${user.id}`);
      setUsers(prev => prev.filter((_, i) => i !== index));
      alert('사용자가 삭제되었습니다.');
    } catch (err) {
      console.error('사용자 삭제 실패:', err);
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  // 사용자 수정 모드로 전환
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // 컴포넌트 마운트 시 사용자 목록 조회
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 폼 필드 정의
  const formFields = [
    {
      name: 'name',
      label: '이름',
      type: 'text',
      required: true,
      placeholder: '이름을 입력하세요',
      validation: {
        required: true,
        minLength: 2,
        message: '이름은 2자 이상이어야 합니다.'
      }
    },
    {
      name: 'email',
      label: '이메일',
      type: 'email',
      required: true,
      placeholder: '이메일을 입력하세요',
      validation: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '올바른 이메일 형식이 아닙니다.'
      }
    },
    {
      name: 'age',
      label: '나이',
      type: 'number',
      placeholder: '나이를 입력하세요',
      validation: {
        pattern: /^\d+$/,
        message: '나이는 숫자만 입력 가능합니다.'
      }
    },
    {
      name: 'role',
      label: '역할',
      type: 'select',
      options: [
        { value: 'user', label: '일반 사용자' },
        { value: 'admin', label: '관리자' },
        { value: 'moderator', label: '모더레이터' }
      ]
    },
    {
      name: 'bio',
      label: '자기소개',
      type: 'textarea',
      placeholder: '자기소개를 입력하세요'
    }
  ];

  // 테이블 컬럼 정의
  const tableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: '이름' },
    { key: 'email', header: '이메일' },
    { key: 'age', header: '나이' },
    { 
      key: 'role', 
      header: '역할',
      render: (value) => {
        const roleMap = {
          'user': '일반 사용자',
          'admin': '관리자',
          'moderator': '모더레이터'
        };
        return roleMap[value] || value;
      }
    },
    { 
      key: 'createdAt', 
      header: '생성일',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="user-management">
      <h1>사용자 관리</h1>
      
      {/* 사용자 생성/수정 폼 */}
      <div className="form-section">
        <h2>
          {editingUser ? '사용자 수정' : '새 사용자 추가'}
        </h2>
        
        <HttpForm
          title=""
          fields={formFields}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          submitText={editingUser ? '수정' : '추가'}
          resetText="취소"
          showReset={editingUser}
        />
        
        {editingUser && (
          <div className="edit-actions">
            <button 
              onClick={handleCancelEdit}
              className="btn btn-secondary"
            >
              수정 취소
            </button>
          </div>
        )}
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="table-section">
        <h2>사용자 목록</h2>
        
        <DataTable
          data={users}
          columns={tableColumns}
          loading={loading}
          error={error}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          emptyMessage="등록된 사용자가 없습니다."
        />
      </div>
    </div>
  );
});

export default UserManagement;
