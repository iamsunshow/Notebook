#coding:utf-8
import os
import shutil
import time
import sys

action_folder_path = unicode(sys.argv[1], 'gbk')

for filename in os.listdir(action_folder_path):
	original_path = os.path.join(action_folder_path, filename)
	
	if(os.path.isdir(original_path)):
		print ("Warning:This action is unsafe!")
		os._exit(0)

for filename in os.listdir(action_folder_path):
	original_path = os.path.join(action_folder_path, filename)
	
	if(not os.path.isdir(original_path)):
		original_file_path = original_path
		original_file_modify_time = os.path.getmtime(original_file_path)
		distinct_folder_name = time.strftime('%Y%m%d', time.localtime(original_file_modify_time)) + u"_中国_北京_"
		distinct_folder_path = os.path.join(action_folder_path, distinct_folder_name)
		distinct_file_path = os.path.join(distinct_folder_path, filename)	
		
		if(filename != sys.argv[0] and os.path.isfile(original_file_path) and (not os.path.exists(distinct_folder_path))):
			os.mkdir(distinct_folder_path)
			
		if(filename != sys.argv[0] and os.path.isfile(original_file_path) and (not os.path.exists(distinct_file_path))):
			shutil.move(original_file_path, distinct_file_path);
			print ("Original photo path:" + original_file_path)
			print ("Distinct folder name:" + distinct_folder_name)
			print ("Distinct photo name:" + distinct_file_path)
			print ('--------------- Move Success ---------------')
