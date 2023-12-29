clean:
	rm -rf public/

serve:
	hugo server

generate:
	hugo --minify

optimize-images:
	find content/ -iname '*.jpg' -o -iname '*.jpeg' -print0 | xargs -0 -P 4 jpegoptim -p --strip-com --strip-iptc -m 94
	find content/ -iname '*.jpg' -o -iname '*.jpeg' -print0 | xargs -0 -P 4 exiftool -overwrite_original -all='*'
	find content/ -iname '*.png' -print0 | xargs -0 -P 4 optipng -strip all -clobber -fix -o9
	find content/ -iname '*.png' -print0 | xargs -0 -P 4 exiftool -overwrite_original -all='*'
