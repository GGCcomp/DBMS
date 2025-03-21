import { AuditLog } from "@/models/user";
import connectMongo from "./db";

export async function logAudit({ req, operation, token }) {
    await connectMongo();
    try {
        const { role, name, department } = token;

        await AuditLog.create({
            user: { name, department, role },
            operation,
            endpoint: req.url,
            method: req.method,
            timestamp: new Date()
        });

        console.log(`✅ Audit Log - ${operation} logged successfully.`);
        
    } catch (error) {
        console.error('❌ Audit log error:', error);
    }
}
