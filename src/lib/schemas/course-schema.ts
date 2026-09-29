import { z } from "zod";
import type { Course } from "@/lib/types";

export const PROGRAMS = ["CPE", "ISNE"] as const;
export const SEMESTERS = ["1", "2", "3"] as const;

const instructorSchema = z.object({
  name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
  email: z
    .string()
    .trim()
    .email("ต้องเป็นอีเมล @cmu.ac.th")
    .refine((v) => v.endsWith("@cmu.ac.th"), "ต้องเป็นอีเมล @cmu.ac.th"),
});

export function createCourseFormSchema(courses: Course[]) {
  return z.object({
    courseId: z
      .string()
      .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
      .refine(
        (id) => !courses.some((c) => c.courseId === id),
        "รหัสวิชานี้มีอยู่แล้ว",
      ),
    courseTitle: z
      .string()
      .trim()
      .min(1, "กรอกชื่อวิชา")
      .max(100, "ชื่อวิชายาวได้ไม่เกิน 100 ตัวอักษร"),
    program: z.enum(PROGRAMS, { message: "เลือกหลักสูตร" }),
    semester: z.enum(SEMESTERS, { message: "เลือกภาคการศึกษา" }),
    description: z.string().max(100, "รายละเอียดยาวได้ไม่เกิน 100 ตัวอักษร"),
    instructors: z
      .array(instructorSchema)
      .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
      .max(3, "มีผู้สอนได้ไม่เกิน 3 คน")
      .refine((list) => {
        const emails = list.map((i) => i.email.trim().toLowerCase());
        return new Set(emails).size === emails.length;
      }, "อีเมลผู้สอนซ้ำกัน"),
    notifyByEmail: z.boolean(),
  });
}

export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;
