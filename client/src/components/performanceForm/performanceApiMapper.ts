import Api from "@/api/api";
import { PerformanceFormValue } from "@/types/performance";

const getPostPerformanceApi = (
  stage: string,
  data: PerformanceFormValue
): Promise<unknown> => {
  const parsedData: PerformanceFormValue = {
    ...data,
    userPerformanceId: data.userPerformanceId,
    criteria: data.criteria.map((item) => ({
      _id: item._id,
      selfScore: Number(item.selfScore),
      selfComments: item.selfComments,
      managerScore: Number(item.managerScore),
      managerComments: item.managerComments,
    })),
    competencies: data.competencies.map((item) => ({
      _id: item._id,
      score: Number(item.score),
    })),
    finalComments: data.finalComments,
  };
  const stageApiMap: {
    [key: string]: (parsedData: PerformanceFormValue) => Promise<unknown>;
  } = {
    self_review: (parsedData: PerformanceFormValue) =>
      Api.addSelfPerformanceForm(parsedData),
    manager_review: (parsedData: PerformanceFormValue) =>
      Api.addManagerPerformanceForm(parsedData),
    admin_review: (parsedData: PerformanceFormValue) =>
      Api.addAdminPerformanceForm(parsedData),
    user_final_review: (parsedData: PerformanceFormValue) =>
      Api.addFinalUserPerformanceForm(parsedData),
  };
  return stageApiMap[stage](parsedData);
};
const getPerformanceApi = (performanceId?: string) => {
  if (performanceId) {
    return () => Api.getPerformanceFormById(performanceId!);
  } else {
    return () => Api.fetchUserPerformanceForm();
  }
};

export { getPostPerformanceApi, getPerformanceApi };
