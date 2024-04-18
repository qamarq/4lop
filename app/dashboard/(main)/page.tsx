import { getAllStatistics } from "@/actions/statistics";
import MainPage from "../_components/MainPage";

export default async function DashboardPage() {
    const statistics = await getAllStatistics();
    
    return (
        <MainPage statistics={statistics} />
    )
}
