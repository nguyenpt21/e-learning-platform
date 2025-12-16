import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetRevenueOverviewQuery } from "@/redux/api/performentApiSlice";
import MetricCard from "@/components/instructor/course-engagement/MetricCard";
import { Spinner } from "@/components/ui/spinner";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const formatCurrency = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

const Overview = () => {
    const [range, setRange] = useState("alltime");
    const { data, isLoading } = useGetRevenueOverviewQuery({ range });

    const summary = data?.summary || {};
    const chartData = useMemo(() => data?.chart || [], [data?.chart]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="size-12" color="#098ce9" />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">Tổng quan hiệu suất</h1>
                        <p className="text-sm text-muted-foreground">
                            Xem nhanh doanh thu, lượt đăng ký và đánh giá giảng viên theo thời gian.
                        </p>
                    </div>
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="alltime">Mọi thời điểm</SelectItem>
                            <SelectItem value="6months">6 tháng qua</SelectItem>
                            <SelectItem value="12months">12 tháng qua</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid gap-8 md:grid-cols-3">
                            <MetricCard
                                title="Tổng doanh thu"
                                value={formatCurrency(summary.totalRevenue || 0)}
                                description={
                                    range === "alltime"
                                        ? "Doanh thu tích lũy từ tất cả lượt đăng ký."
                                        : "Doanh thu trong khoảng thời gian đã chọn."
                                }
                                tooltip="Tổng số tiền bạn đã kiếm được trong khoảng thời gian chọn ở bộ lọc."
                                unit=""
                            />
                            <MetricCard
                                title="Tổng lượt đăng ký"
                                value={summary.totalEnrollments || 0}
                                description={
                                    range === "alltime"
                                        ? "Lượt đăng ký khóa học trong toàn bộ thời gian."
                                        : "Lượt đăng ký khóa học trong khoảng thời gian đã chọn."
                                }
                                tooltip="Tổng số lần học viên mua/đăng ký khóa học trong khoảng thời gian được chọn."
                                unit=""
                            />
                            <MetricCard
                                title="Đánh giá giảng viên"
                                value={
                                    summary.instructorRating?.toFixed
                                        ? summary.instructorRating.toFixed(2)
                                        : summary.instructorRating || 0
                                }
                                description={
                                    range === "alltime"
                                        ? `${summary.ratingCount || 0} lượt đánh giá mọi thời điểm.`
                                        : `${summary.ratingCount || 0} lượt đánh giá trong khoảng thời gian đã chọn.`
                                }
                                tooltip="Điểm đánh giá trung bình từ các review của học viên trong khoảng thời gian được chọn."
                                unit="/ 5"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-semibold">Biểu đồ doanh thu theo thời gian</p>
                            <span className="text-sm text-muted-foreground">
                                Phạm vi: {range === "alltime" ? "Mọi thời điểm" : range === "6months" ? "6 tháng gần nhất" : "12 tháng gần nhất"}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height={384}>
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#BDE4F9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={{ stroke: "#007DD1" }}
                                        label={{
                                            position: "insideBottomCenter",
                                            value: "Thời gian",
                                            dy: 20,
                                        }}
                                    />
                                    <YAxis
                                        axisLine={{ stroke: "#007DD1" }}
                                        label={{
                                            position: "insideTopCenter",
                                            value: "Doanh thu (VNĐ)",
                                            angle: -90,
                                            dx: -45,
                                        }}
                                    />
                                    <Tooltip
                                        animationDuration={150}
                                        cursor={false}
                                        formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                                        contentStyle={{
                                            backgroundColor: "#FFFFFF",
                                            border: "1px solid #CFCFCF",
                                            borderRadius: "var(--radius)",
                                        }}
                                        labelStyle={{ color: "#000000" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#2EABFF"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;


