BEGIN { print "Середні бали груп потоку ПЗПІ-17" }
{
grad[$1] += $3;
numOfGrad[$1]++;	
}
END {
for (key in grad)
	print key " "  grad[key]/numOfGrad[key]|"sort";

}
	
