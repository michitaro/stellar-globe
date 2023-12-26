function run {
    echo "Compiling..." 
    jlpm run build
    echo "Watching..."
}

run

fswatch -o --recursive --batch-marker --one-per-batch ./node_modules ./src | while read -r event; do
    if [[ $event == "NoOp" ]]; then
        run
    fi
done
