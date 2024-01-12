// "use server";
import { NextResponse } from "next/server";
import * as fs from "fs";

export async function POST(request: Request) {
  const { idNumber } = await request.json();

  const filePath = "src/logs/log_dpt_create.json";
  const dataLogProgress = fs.readFileSync(filePath, "utf-8");

  let logData: { processID: string[] } = { processID: [] };

  logData = JSON.parse(dataLogProgress);
  logData.processID.push(`${idNumber}`);
  fs.writeFileSync(filePath, JSON.stringify(logData));

  return NextResponse.json({ messege: "success" }, { status: 200 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idNumber = searchParams.get("idNumber");
  let logData: { processID: any[] } = { processID: [] };

  const filePath = "src/logs/log_course_sincronitation.json";

  if (fs.existsSync(filePath)) {
    const dataLogProgress = fs.readFileSync(filePath, "utf-8");
    logData = JSON.parse(dataLogProgress);

    if (logData.processID.includes(idNumber)) {
      return NextResponse.json(
        { messege: "seccess", value: true },
        { status: 200 }
      );
    }
  } else {
    fs.writeFileSync(filePath, JSON.stringify({ processID: [] }));
  }

  return NextResponse.json(
    { messege: "seccess", value: false },
    { status: 200 }
  );
}

export async function DELETE() {
  const filePath = "src/logs/log_course_sincronitation.json";

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return NextResponse.json({ messege: "seccess" }, { status: 200 });
}
