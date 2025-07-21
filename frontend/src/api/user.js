import axios from "axios";

export const getCurrentUserProfile = async () => {
    try {
        const res = await axios.get("http://localhost:5002/api/auth/profile", {
            withCredentials: true, // Needed to send cookies
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching current profile:", err);
        throw err;
    }
};
