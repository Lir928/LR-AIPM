#!/usr/bin/env bash

set -u

print_ai_prompt() {
  local issue="${1:-未提供错误详情}"
  echo "AI求助：我在 macOS 启动 Axhub Make 失败，问题：${issue}，项目路径：$(pwd)。请直接带我修到 pnpm run dev 成功（我有安装权限），并按每次只给我下一条可执行命令的方式直到成功。"
}

echo "[1/3] 检查 Node.js、npm、pnpm、Git..."

missing_required_tools=()
missing_optional_tools=()

if ! command -v node >/dev/null 2>&1; then
  missing_required_tools+=("Node.js")
fi

if ! command -v pnpm >/dev/null 2>&1; then
  missing_required_tools+=("pnpm")
fi

if ! command -v npm >/dev/null 2>&1; then
  missing_required_tools+=("npm")
fi

if ! command -v git >/dev/null 2>&1; then
  missing_optional_tools+=("Git")
fi

if [ "${#missing_optional_tools[@]}" -gt 0 ]; then
  echo "[提示] Git 未安装，将继续执行安装依赖和启动流程。"
  print_ai_prompt "检测到缺少可选工具：${missing_optional_tools[*]}。当前会继续执行安装依赖和启动。如需拉取代码请安装 Git。"
fi

if [ "${#missing_required_tools[@]}" -gt 0 ]; then
  issue="检测到缺少必需工具：${missing_required_tools[*]}。"
  if [ "${#missing_optional_tools[@]}" -gt 0 ]; then
    issue="$issue 同时缺少可选工具：${missing_optional_tools[*]}。"
  fi
  print_ai_prompt "$issue 请先安装后重试。"
  exit 1
fi

need_install=0

if [ ! -d "node_modules" ]; then
  need_install=1
fi

if [ "$need_install" -eq 1 ]; then
  echo "[2/3] 安装依赖（pnpm install）..."
  echo "[提示] 首次打开或依赖更新时，安装可能需要几分钟，请耐心等待。"
  if ! pnpm install; then
    print_ai_prompt "执行 pnpm install 失败。请分析报错并给我修复步骤。"
    exit 1
  fi
else
  echo "[2/3] 依赖已安装，跳过 pnpm install。"
fi

echo "[3/3] 启动开发服务（pnpm run dev）..."
if ! pnpm run dev; then
  print_ai_prompt "执行 pnpm run dev 失败。请分析报错并给我修复步骤。"
  exit 1
fi
