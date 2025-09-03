#\!/bin/bash
# 批量移除所有子模块
echo "开始移除所有子模块..."

# 获取所有子模块路径
submodules=$(git ls-files --stage | grep "160000" | cut -f2)

count=0
for submodule in $submodules; do
    count=$((count + 1))
    echo "[$count/126] 正在移除子模块: $submodule"
    
    # 从git索引中移除子模块
    git rm --cached "$submodule" 2>/dev/null
    
    # 添加目录内容到git
    git add "$submodule"
done

echo "所有子模块已移除并转换为普通目录"
