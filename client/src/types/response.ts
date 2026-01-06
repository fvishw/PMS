type IAnswer = {
  _id: string;
  question: string;
  type: "rating" | "text";
  answer: string;
};

interface PastCheckIns {
  answers: IAnswer[];
}

export { PastCheckIns };
