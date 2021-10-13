clean:
	rm -rf public/

generate:
	hugo --minify

optimize-images:
	find content/ -iname '*.jpg' -o -iname '*.jpeg' -print0 | xargs -0 -P 4 jpegoptim -p --strip-com --strip-iptc -m 94
	find content/ -iname '*.jpg' -o -iname '*.jpeg' -print0 | xargs -0 -P 4 exiftool -overwrite_original -all='*'
	find content/ -iname '*.png' -print0 | xargs -0 -P 4 optipng -strip all -clobber -fix -o9
	find content/ -iname '*.png' -print0 | xargs -0 -P 4 exiftool -overwrite_original -all='*'

upload:
	rsync -e "ssh -p 1164 -l root " -arv public/ root@oldweb-4zvooa4g3oz.clster.systems:/var/www/edenmal.moe/public_html --delete
