poly:
	rm -rf poly-faustnode
	faust2nodejs -coreaudio -midi -nvoices 16 -debug poly.dsp
