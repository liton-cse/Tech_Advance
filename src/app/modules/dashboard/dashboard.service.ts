import { CoachingUserModel } from '../coaching/coaching.model';

const getMonthlyApplicants = async () => {
  try {
    const result = await CoachingUserModel.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          totalApplicants: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const formatted = result.map(item => ({
      month: monthNames[item._id.month - 1],
      value: item.totalApplicants,
    }));

    return formatted;
  } catch (error) {
    throw new Error('Error fetching monthly applicants: ' + error);
  }
};

export const DashboardService = {
  getMonthlyApplicants,
};
