# %load_ext Cython
# %%cython

# import psyco
# psyco.full()












from time import sleep
import os
import copy
import glob
from flask_socketio import SocketIO, send, emit
import pandas as pd
from flask import Flask, render_template, jsonify
from flask import request
from sklearn import svm
import random
import json
import ast
import itertools
import numpy as np
import timeit
from timeit import default_timer as timer









app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/", methods=['GET', 'POST'])
def main():
	return render_template('index.html')


class Transformer(ast.NodeTransformer):
	ALLOWED_NAMES = set(['Decimal', 'None', 'False', 'True'])
	ALLOWED_NODE_TYPES = set([
		'Expression',  # a top node for an expression
		'Tuple',      # makes a tuple
		'Call',       # a function call (hint, Decimal())
		'Name',       # an identifier...
		'Load',       # loads a value of a variable with given identifier
		'Str',        # a string literal
		'Num',        # allow numbers too
		'List',       # and list literals
		'Dict',       # and dicts...
	])

	def visit_Name(self, node):
		if not node.id in self.ALLOWED_NAMES:
			print('node', node)
			raise RuntimeError("Name access to %s is not allowed" % node.id)

		# traverse to child nodes
		return self.generic_visit(node)

	def generic_visit(self, node):
		nodetype = type(node).__name__
		if nodetype not in self.ALLOWED_NODE_TYPES:
			raise RuntimeError("Invalid expression: %s not allowed" % nodetype)

		return ast.NodeTransformer.generic_visit(self, node)


@app.route("/call_backend", methods=['GET', 'POST'])
def call_backend():    
    sleep(1)
    os.system('clear') 
    r = request.form.values()
    print " in python due to ajax call "
    dataOut = []
    modelOutArr = [None] * 2
    for x in r:
        x = json.loads(x)
    return json.dumps([0,1]) 
		
@app.route('/predictionRatingHistogram', methods = ['POST'])
def get_post_MlModel():
	path ='data/prediction' # use your path
	allPredictionFiles = glob.glob(path + "/*.csv")

	frame = pd.DataFrame()
	list_ = []
	bins_list = []
	HisPredData = []
	HisDeltaData = []
	index =1;
	rows=45000;

	learningData = pd.read_csv("data/learning/learningData.csv",index_col=None, header=0)
	learningData = learningData.iloc[0:rows]

	for file_ in allPredictionFiles:  #goes through every single model in the folder
		df = pd.read_csv(file_,index_col=None, header=0)  # reads the content of the files
		df = df.rename(index=str, columns={"rating": "predictedRating"}) # change the col
		df = df.iloc[0:rows]
		df_join = pd.merge(learningData, df, on='d3mIndex', how='right')
		df_join = df_join.fillna(0);
		df_delta = df_join['predictedRating'] - df_join['rating']
		HisPredData.append(df["predictedRating"].tolist())
		HisDeltaData.append(df_delta.tolist())
	data1 = json.dumps(HisPredData)
	data2 = json.dumps(HisDeltaData)
	return jsonify({"predictData":data1, "deltaData":data2 })

        
if __name__ == "__main__":    	
    import warnings
    warnings.filterwarnings("ignore")	

    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    #app.run(host = '0.0.0.0', port = port)
    socketio.run(app)
