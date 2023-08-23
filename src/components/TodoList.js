import {useCallback, useEffect, useState} from "react";

const TodoList = () => {
  const url = "/todo";
  const [inputTodo, setInputTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [inputEdit, setInputEdit] = useState("");
  const [editItem, setEditItem] = useState({
    id: "",
    title: "",
    edit: false,
  });

  // 共用函式
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const resJson = await res.json();
        console.log("fetch Json:\n", resJson);
        setTodoList(resJson);
      }
    } catch (e) {
      console.error("Fetch todo error:\n", e);
    }
  }, []);
  // 初始化fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddInput = (e) => {
    setInputTodo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTodo = inputTodo;
    if (!newTodo) {
      return;
    }
    setInputTodo("");

    const postRes = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title: newTodo}),
    });

    if (postRes.ok) {
      await fetchData();
    }
  };

  const handleCompleted = async (item) => {
    const putRes = await fetch(`${url}/${item.id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({completed: !item.completed}),
    });
    if (putRes.ok) {
      await fetchData();
    }
  };

  const handleEditClick = (item) => {
    setEditItem({id: item.id, title: item.title, edit: true});
    setInputEdit(item.title);
  };

  const handleEditChange = (e) => {
    if (editItem.edit) {
      const inputEdit = e.target.value;
      setInputEdit(inputEdit);
    }
  };

  const handelEditSave = async (e) => {
    e.preventDefault();
    const submitInput = inputEdit;
    setInputEdit(submitInput);
    const prevTitle = editItem.title;
    if (editItem.edit && submitInput !== prevTitle) {
      const putRes = await fetch(`${url}/${editItem.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: submitInput}),
      });
      if (putRes.ok) {
        await fetchData();
      }
    }
    setEditItem({
      id: "",
      title: "",
      edit: false,
    });
    setInputEdit("");
  };

  const handleDelete = async (item) => {
    const res = await fetch(`${url}/${item.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchData();
    }
  };

  const renderedTodo = todoList.map((item, index) => (
    <tr
      key={index}
      style={{
        color: editItem.id === item.id && editItem.edit ? "red" : "black",
        textDecoration: item.completed ? "line-through" : "none",
      }}
    >
      <td>{item.id}</td>
      <td>{item.title}</td>
      <td onClick={() => handleCompleted(item)}>
        {item.completed ? "V" : "X"}
      </td>
      <td onClick={() => handleEditClick(item)}></td>
      <td onClick={() => handleDelete(item)}>X</td>
    </tr>
  ));

  return (
    <div>
      <p>Add new Todo</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Input todo"
          onChange={handleAddInput}
          value={inputTodo}
        />
        <button type="submit">Add</button>
      </form>
      <p>Edit item</p>
      <form onSubmit={handelEditSave}>
        <input type="text" value={inputEdit} onChange={handleEditChange} />
        <button type="submit">Save Edit</button>
      </form>
      <p>Todo List</p>
      <table border={1}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Completed</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderedTodo}</tbody>
      </table>
    </div>
  );
};

export default TodoList;
