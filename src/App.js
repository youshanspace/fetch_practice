import {useEffect, useState} from "react";

const App = () => {
  const [userURL, commentURL] = ["/user", "/comment"];
  const [userList, setUserList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    year: 0,
  });

  /* 單個 fetch */
  // const fetchUserData = async () => {
  //   try {
  //     const res = await fetch(userURL);
  //     if (!res.ok) {
  //       console.error("Fetch user API error");
  //       return;
  //     }
  //     const resData = await res.json();
  //     const userData = resData.data;
  //     if (!userData) {
  //       console.error("Fetch userData error");
  //       return;
  //     }
  //     console.log(userData);
  //     setUserList(userData);
  //   } catch (e) {
  //     console.error("fetchUserData error:\n", e);
  //   }
  // };

  /* 多個 fetch */
  const fetchUserDataMulti = () => {
    return fetch(userURL)
      .then((res) => {
        if (!res.ok) {
          console.error("Fetch user API error");
          return Promise.resolve("");
        } else {
          return res.json();
        }
      })
      .catch((e) => {
        console.error("Fetch userMulti API error:\n", e);
        return Promise.resolve("");
      });
  };
  const fetchCommentDataMulti = () => {
    return fetch(commentURL)
      .then((res) => {
        if (!res.ok) {
          console.error("Fetch comment API error");
          return Promise.resolve("");
        } else {
          return res.json();
        }
      })
      .catch((e) => {
        console.error("Fetch commentMulti API error\n", e);
        return Promise.resolve("");
      });
  };
  const fetchData = async () => {
    const [userJson, commentJson] = await Promise.all([
      fetchUserDataMulti(),
      fetchCommentDataMulti(),
    ]);
    console.log("userJson:\n", userJson);
    console.log("commentJson:\n", commentJson);
    if (userJson.data) {
      console.log("user list:\n", userJson.data);
      setUserList(userJson.data);
    }
    if (commentJson.data) {
      console.log("comment list:\n", commentJson.data);
      setCommentList(commentJson.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitUser = async (e) => {
    try {
      e.preventDefault();
      const submitFormData = formData;
      console.log("Submit form data:\n", submitFormData);
      setFormData({
        name: "",
        year: 0,
      });
      const res = await fetch(userURL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(submitFormData),
      });
      // POST ok -> ReFetch
      if (res.ok) {
        const userJson = await fetchUserDataMulti();
        if (userJson.data) {
          console.log("ReFetch user list:\n", userJson.data);
          setUserList(userJson.data);
        }
      }
    } catch (err) {
      console.error("Post user data error");
    }
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
    <div>
      <form onSubmit={handleSubmitUser}>
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
};

export default App;
