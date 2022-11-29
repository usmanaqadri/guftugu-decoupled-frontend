import React, { useState, useEffect } from "react";
import Card from "../components/Card";

function Groups() {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/group/`)
      .then((res) => res.json())
      .then((data) => setGroups([...data.group]));
  }, []);
  return (
    <div className="group-grid">
      {groups.map((group) => (
        <Card
          key={group._id}
          cardId={group._id}
          title={group.name}
          link={`/group/${group._id}`}
          imgUrl={group.img}
          desc={"just some description"}
        />
      ))}
    </div>
  );
}

export default Groups;
