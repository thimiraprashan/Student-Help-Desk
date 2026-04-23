import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";

const CompanyFeedback = () => {
  const [companyName, setCompanyName] = useState("Company");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const savedSession = getCompanySession();
    if (savedSession?.name) {
      setCompanyName(savedSession.name);
    }

    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(storedReviews);
  }, []);

  const companyReviews = useMemo(() => {
    const currentCompany = companyName.trim().toLowerCase();

    return reviews.filter((review) => {
      const reviewCompany = String(review.company || "").trim().toLowerCase();

      return (
        reviewCompany === currentCompany ||
        reviewCompany.includes(currentCompany) ||
        currentCompany.includes(reviewCompany)
      );
    });
  }, [companyName, reviews]);

  const averageRating =
    companyReviews.length === 0
      ? 0
      : (
          companyReviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
          companyReviews.length
        ).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = companyReviews.filter(
      (review) => Number(review.rating || 0) === rating
    ).length;
    const percentage =
      companyReviews.length === 0 ? 0 : Math.round((count / companyReviews.length) * 100);

    return { rating, count, percentage };
  });

  const renderStars = (rating) => {
    const value = Math.max(0, Math.min(5, Math.round(Number(rating || 0))));

    return (
      <span className="whitespace-nowrap text-xl text-yellow-400">
        {"★".repeat(value)}
        {"☆".repeat(5 - value)}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar session={{ name: companyName }} role="company" />

      <div className="flex-1 p-6 lg:p-8">
        <div className="mb-8 rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-500">
            Student Feedback
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                Feedback Ratings
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                View ratings and feedback students submitted for your company.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-blue-200 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Average</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {averageRating}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-white/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600">Total</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {companyReviews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {companyReviews.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">No feedback yet</h3>
            <p className="mt-3 text-sm text-slate-500">
              Student ratings for {companyName} will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Rating Overview
              </p>

              <div className="mt-4 flex items-end gap-3">
                <p className="text-5xl font-bold text-slate-900">{averageRating}</p>
                <div className="pb-1">
                  {renderStars(Math.round(Number(averageRating)))}
                  <p className="mt-1 text-xs text-slate-500">
                    Based on {companyReviews.length} reviews
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {ratingDistribution.map((item) => (
                  <div
                    key={item.rating}
                    className="grid grid-cols-[48px_1fr_48px] items-center gap-3 text-sm"
                  >
                    <span className="font-medium text-slate-600">{item.rating} star</span>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-yellow-400"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-right text-xs text-slate-500">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Feedback List
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Detailed student comments are shown as rows for easy review.
              </p>

              <div className="mt-4 overflow-x-auto rounded-xl border border-blue-100">
                <div className="min-w-[780px]">
                  <div className="grid grid-cols-[1.2fr_130px_1.8fr_110px] bg-blue-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    <div>Student</div>
                    <div>Rating</div>
                    <div>Comment</div>
                    <div>Date</div>
                  </div>

                  {companyReviews.map((review, index) => (
                    <div
                      key={`${review.company}-${review.date}-${index}`}
                      className="grid grid-cols-[1.2fr_130px_1.8fr_110px] items-center border-t border-blue-100 px-4 py-4 text-sm transition hover:bg-blue-50"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.name || "Student"}
                        </p>
                        <p className="mt-1 text-xs font-medium text-blue-600">
                          {review.company}
                        </p>
                      </div>

                      <div>{renderStars(review.rating)}</div>

                      <p className="leading-6 text-slate-600">{review.comment}</p>

                      <p className="text-xs text-slate-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyFeedback;