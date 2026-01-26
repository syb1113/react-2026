import { useState } from 'react'
import { 
  Card,
  Input,
  Button,
  List,
  Checkbox,
  Typography,
  Space,
  Tag,
  Empty,
  message
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import './TodoListPage.css'

// 定义待办事项的类型接口
interface Todo {
  // 唯一标识符
  id: number
  // 待办事项内容
  text: string
  // 是否已完成
  completed: boolean
}

const { Text, Title } = Typography

function TodoListPage() {
  // 使用useState Hook管理待办事项列表
  // setTodos: 更新待办事项列表的函数
  const [todos, setTodos] = useState<Todo[]>([])

  // 使用useState Hook管理输入框的值
  // inputValue: 当前输入框中的文本
  // setInputValue: 更新输入框文本的函数
  const [inputValue, setInputValue] = useState<string>('')

  /**
   * 添加新的待办事项
   * 当用户点击添加按钮或按Enter键时调用
   */
  const handleAddTodo = () => {
    // 检查输入框是否为空（去除首尾空格后）
    if (inputValue.trim() === '') {
      // 使用 antd 的 message 组件显示提示信息
      message.warning('请输入待办事项内容')
      return // 如果为空，直接返回，不添加
    }

    // 创建新的待办事项对象
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    }

    // 使用setTodos更新状态，将新待办事项添加到列表末尾
    setTodos([...todos, newTodo])

    // 清空输入框
    setInputValue('')

    // 显示成功提示
    message.success('待办事项添加成功')
  }

  /**
   * 切换待办事项的完成状态
   * @param id - 待办事项的唯一标识符
   */
  const toggleTodo = (id: number) => {
    // 使用map方法遍历待办事项列表
    // 找到匹配的id后，切换其completed状态
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  /**
   * 删除待办事项
   * @param id - 待办事项的唯一标识符
   */
  const deleteTodo = (id: number) => {
    // 使用filter方法过滤掉指定id的待办事项
    setTodos(todos.filter(todo => todo.id !== id))
    
    // 显示删除成功提示
    message.success('待办事项已删除')
  }

  // 计算统计信息
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const remainingTodos = totalTodos - completedTodos

  return (
    <div className="todo-page-container">
      {/* 使用 Card 组件包装整个内容区域 */}
      <Card 
        title={
          <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
            待办事项列表
          </Title>
        }
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        {/* 输入区域 - 使用 Space 组件设置间距 */}
        <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
          <Input
            size="large"
            placeholder="输入待办事项..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddTodo}
            allowClear
          />
          <Button 
            type="primary" 
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddTodo}
          >
            添加
          </Button>
        </Space.Compact>

        {/* 统计信息区域 - 使用 Tag 组件显示统计 */}
        <Space size="middle" style={{ marginBottom: 16, justifyContent: 'center', width: '100%' }}>
          <Tag color="blue">总计: {totalTodos}</Tag>
          <Tag color="green">已完成: {completedTodos}</Tag>
          <Tag color="orange">未完成: {remainingTodos}</Tag>
        </Space>

        {/* 待办事项列表 - 使用 List 组件 */}
        {todos.length === 0 ? (
          // 使用 Empty 组件显示空状态
          <Empty 
            description="暂无待办事项，添加一个开始吧！"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={todos}
            renderItem={(todo) => (
              <List.Item
                key={todo.id}
                style={{
                  padding: '12px 0',
                  opacity: todo.completed ? 0.6 : 1,
                  backgroundColor: todo.completed ? '#f0f0f0' : 'transparent',
                  borderRadius: 4,
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
                actions={[
                  // 删除按钮 - 使用图标按钮
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTodo(todo.id)}
                    title="删除"
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={
                    // 复选框 - 用于切换完成状态
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                  }
                  title={
                    // 待办事项文本 - 点击文本也可以切换完成状态
                    <Text
                      delete={todo.completed}
                      style={{
                        cursor: 'pointer',
                        color: todo.completed ? '#999' : '#333',
                      }}
                      onClick={() => toggleTodo(todo.id)}
                    >
                      {todo.text}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}

export default TodoListPage

