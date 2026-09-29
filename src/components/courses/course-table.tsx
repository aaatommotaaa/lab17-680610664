import { ConfirmDeleteButton } from "@/components/confirm-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

const semesterLabels: Record<string, string> = {
  "1": "ภาคการศึกษาที่ 1",
  "2": "ภาคการศึกษาที่ 2",
  "3": "ภาคฤดูร้อน",
};

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell className="whitespace-normal">
                {course.courseTitle}
              </TableCell>
              <TableCell>
                {course.program ? (
                  <Badge variant="outline">{course.program}</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {course.semester ? semesterLabels[course.semester] : "—"}
              </TableCell>
              <TableCell className="max-w-48 whitespace-normal text-muted-foreground">
                {course.description || "—"}
              </TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div className="grid gap-2">
                    {course.instructors.map((i) => (
                      <div key={i.email} className="leading-tight">
                        <div className="text-sm">{i.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {i.email}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={course.notifyByEmail ? "default" : "secondary"}>
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
