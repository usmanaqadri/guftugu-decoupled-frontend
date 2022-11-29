import React from "react";
import Card from "../components/Card";

function Programs() {
  return (
    <div>
      <section>
        <header>
          <h2>Programs</h2>
        </header>
        <div className="program-board">
          <Card
            title={"Urdu Book Club"}
            imgUrl={"/assets/book.png"}
            desc={
              "Join a group that meets weekly to discuss classics in Urdu literature, including Urdu poetry."
            }
          />
          <Card
            title={"Teach Urdu to Kids"}
            imgUrl={"/assets/teaching.png"}
            desc={
              "Meet weekly with Pakistani youth for a 15 or 30 minute session where you chat with them in Urdu, with the aim of improving their conversational ability and confidence."
            }
          />
          <Card
            title={"Quran Something"}
            imgUrl={"/assets/quran.png"}
            desc={
              "Sign up to have an accountability partner who can help you reach your Quran goals in review, memorization, tafseer, and more."
            }
          />
          <Card
            title={"Exercise Challenges"}
            imgUrl={"/assets/exercise.png"}
            desc={
              "Participate in light exercise challenges including meeting daily step goals and stretching."
            }
          />
        </div>
      </section>
    </div>
  );
}

export default Programs;
