#!/usr/bin/env python3
"""
截图命名辅助工具
根据规范生成截图文件名

命名格式：功能页面名称_功能点名称_组件类型_可实现的功能.png
"""

import os
from datetime import datetime


def generate_screenshot_name(page_name, feature_name, component_type, function_desc):
    """
    生成规范的截图文件名

    Args:
        page_name: 功能页面名称，如 "模板管理"
        feature_name: 功能点名称，如 "质量管理"
        component_type: 组件类型，如 "弹窗"、"列表"、"表单"
        function_desc: 可实现的功能，如 "任务创建"

    Returns:
        规范的截图文件名
    """
    parts = [page_name, feature_name, component_type, function_desc]
    filename = "_".join(parts) + ".png"
    return filename


def get_screenshot_dir(base_dir, page_name):
    """
    获取截图保存目录路径

    Args:
        base_dir: 基础目录，默认为 "操作手册编写/images"
        page_name: 功能页面名称

    Returns:
        截图保存目录的完整路径
    """
    return os.path.join(base_dir, page_name)


def ensure_screenshot_dir(base_dir, page_name):
    """
    确保截图目录存在

    Args:
        base_dir: 基础目录
        page_name: 功能页面名称

    Returns:
        创建的目录路径
    """
    dir_path = get_screenshot_dir(base_dir, page_name)
    os.makedirs(dir_path, exist_ok=True)
    return dir_path


# 组件类型参考
COMPONENT_TYPES = [
    "主页面",
    "列表",
    "表单",
    "弹窗",
    "Tab页",
    "导航",
    "按钮",
    "筛选区",
    "详情页",
    "其他"
]


if __name__ == "__main__":
    # 示例用法
    example = generate_screenshot_name(
        page_name="模板管理",
        feature_name="质量管理",
        component_type="弹窗",
        function_desc="任务创建"
    )
    print(f"示例文件名: {example}")