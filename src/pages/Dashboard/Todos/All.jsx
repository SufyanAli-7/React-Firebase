import { firestore } from "@/config/firebase"
import { useAuth } from "@/context/Auth"
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons"
import { Typography, Button, Space, Table, Dropdown } from "antd"
import dayjs from "dayjs"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const { Title, Text } = Typography


const All = () => {
 
  const { user } = useAuth()
  const Navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const getTodos = async () => {
    setIsLoading(true)
    const q = query(collection(firestore, "todos"), where("uid", "==", user.uid),);
    const querySnapshot = await getDocs(q);
    const array = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const todo = doc.data()
      array.push({ ...todo, key: todo.id })
    });
    setTodos(array)
    setIsLoading(false)

  }

  useEffect(() => {
    getTodos()
  }, [])


  const handelDelete = async (record) => {
    try {
      await deleteDoc(doc(firestore, "todos", record.id));
      const filteredTodos = todos.filter(todo => todo.id !== record.id)
      setTodos(filteredTodos)
      window.toastify("Todo deleted successfully", "success")
    } catch (e) {
      console.error("Error deleting document: ", e);
      window.toastify("Failed to delete todo", "error")
    }
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: createdAt => <Text>{dayjs(createdAt).format("ddd DD-MMM-YYYY , hh:mm:ss A")}</Text>
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: dueDate => <Text>{dayjs(dueDate).format("ddd DD-MMM-YYYY")}</Text>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: priority => {
        let color = "green"
        if (priority === "high") {
          color = "red"
        } else if (priority === "medium") {
          color = "orange"
        }
        return <span className="text-capitalize" style={{ color }}>{priority}</span>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{
          items: [
            {
              label: "Edit",
              key: "edit",
              icon: <EditOutlined style={{ color: "blue" }} onClick={() => { Navigate(`/dashboard/todos/edit/${record.id}`) }} />
            },
            {
              label: "Delete",
              key: "delete",
              icon: <DeleteOutlined style={{ color: "red" }} onClick={() => { handelDelete(record) }} />
            }
          ]
        }} trigger={'click'}>
          <Button className="border-0" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <main className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <Title level={2} className="mb-0">Todos</Title>
        <Button type="primary" size="small" onClick={() => { Navigate("/dashboard/todos/add") }}>Add Todo</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={todos} loading={isLoading} />
    </main>
  )
}

export default All