import {useEffect, useState} from "react";

function App() {
  const [userURL, commentURL] = ["/user", "/comment"];
  const [userList, setUserList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    year: 0,
  });

  /* 多個 fetch */
  const fetchUserDataMulti = () => {
    return fetch(userURL)
      .then((res) => res.json())
      .catch((e) => new Error(e));
  };
  const fetchCommentDataMulti = () => {
    return fetch(commentURL)
      .then((res) => res.json())
      .catch((e) => new Error(e));
  };

  useEffect(() => {
    /* 單個 fetch */
    // const fetchUserData = async () => {
    //   const res = await fetch(userURL);
    //   const resData = await res.json();
    //   const userData = resData.data;
    //   console.log("Fetch user data...");
    //   console.log(userData);
    //   setUserList(userData);
    // };
    // fetchUserData();

    /* 多個 fetch */
    const fetchData = async () => {
      const data = await Promise.all([
        fetchUserDataMulti(),
        fetchCommentDataMulti(),
      ]);
      console.log(data);
      setUserList(data[0].data);
      setCommentList(data[1].data);
    };
    fetchData();
  }, []);

  const addUser = async (formData) => {
    const res = await fetch(userURL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });
    const resData = await res.json();
    const userData = resData.data;
    console.log(userData);
    setUserList(userData);
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const submitFormData = formData;
    console.log("Submit form data:");
    console.log(submitFormData);
    setFormData({
      name: "",
      year: 0,
    });
    addUser(submitFormData);
  };

  const renderedUserItem = userList.map((user, index) => (
    <tr key={index}>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.year}</td>
    </tr>
  ));
  const renderedCommentItem = commentList.map((item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.userId}</td>
      <td>{item.content}</td>
    </tr>
  ));

  return (
    <div className="App">
      <form onSubmit={handleSubmitUser}>
        <br />
        <label>Name: </label>
        <input
          type="text"
          placeholder="Input name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
        <br />
        <label>Year: </label>
        <input
          type="text"
          placeholder="Input Year"
          value={formData.year}
          onChange={(e) =>
            setFormData({
              ...formData,
              year: Number(e.target.value) || 0,
            })
          }
        />
        <br />
        <button type="submit">Add</button>
      </form>

      <div>
        <div>User List:</div>
        <table border={1}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>{renderedUserItem}</tbody>
        </table>
      </div>

      <div>
        <div>Comment List:</div>
        <table border={1}>
          <thead>
            <tr>
              <th>CommentId</th>
              <th>UserId</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>{renderedCommentItem}</tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
