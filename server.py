#!/usr/bin/python

import sys, getopt, subprocess
from os import walk

def main(argv):

    #initialize default
    name = "/ndn/coba"
    chunksize = 8192
    ver = "none"

    #initialize argument
    try:
        opts, args = getopt.getopt(argv,"hn:c:v:",["help","name=","chunk=","ver="])
    except getopt.GetoptError:
        print ('use -h or --help for help')
        sys.exit(2)

    #checking argument
    for opt, arg in opts :
        if opt in ("-h", "--help") :
            print ("")
            sys.exit()
        elif opt in ("-n", "--name") :
            name = arg
        elif opt in ("-c", "--chunk") :
            chunksize = arg
        elif opt in ("-v", "--ver") :
            ver = arg
    filenames = next(walk("."), (None, None, []))[2]

    #generate initial.sh
    file = open("run.sh","wb")
    string = ""
    for i in filenames :
        if ".ts" in i or ".m3u8" in i:
            string = string + "ndncat put "+name+"/"+i+" --chunk-size "+str(chunksize)+" --ver="+ver+" < "+i+" &> /dev/null &\n"
    string = string + "echo 'Run!'"
    file.write(string.encode())
    file.close

    subprocess.run("bash run.sh")

#start main
if __name__ == "__main__":
   main(sys.argv[1:])