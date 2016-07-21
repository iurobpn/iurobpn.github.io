#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import numpy as np
import pdb
import argparse

def main(input_filename,output_filename,svd,percent):
    with open(input_filename,'r') as file:
        header = file.readline()
        header = header.strip().split(',')
        features = header[:-2]
        C = len(header)-2
        i=0
        M = np.zeros(C)
        A = np.zeros(C)
        nonnumber_data = [] # lista com tuplas (livro,author,epoca)
        for line in file:
            line = line.strip().split(',')
            # pdb.set_trace()
            #retira name do livro, autor e epoca
            v = np.array(map(float,line[:-2]))
            M = np.vstack((M,v))
            nonnumber_data.append((line[-2],line[-1]))

    #redução de features via SVD
    M = M[1:]
    print 'Features: ', M.shape[1]
    if svd:
        features, Mr = reduce_svd(M,percent,features)
    else:
        Mr = pca(M,percent)
    print 'Reduced features to: ', Mr.shape[1]

    with open(output_filename, 'w') as outfile:
        tmp = header[-2],header[-1]
        # header = header[1:-2]
        # header = header[:num_sv]
        s = ','.join([','.join(['x','y']),','.join(features),','.join(tmp)]) + '\n'
        outfile.write(s)
        i=0
        for author,epoch in nonnumber_data:
            sr = map(str,Mr[i])
            sm = map(str, M[i])
            s = ','.join([','.join(sr),','.join(sm),author,epoch]) + '\n'
            outfile.write(s)
            i += 1


def reduce_svd(M,percent,features=''):
    """calcula o SVD e diminui a dimensão da matriz M contendo percent %
        dos principais componentes(eigenvalues)

    :M: Matriz onde os vetores de dados estao em linhas,
        features estão representadas em colunas
    :percent: porcentagem dos componentes a ser usado
    :returns: M reduzida

    """
    if not features:
        features = np.arange(M.shape[0])
    perc = percent/100.0
    # print 'M=', M.shape
    U,s,V = np.linalg.svd(M,full_matrices=False)
    # print 'U=',U.shape
    # print 's=',s.shape

    ssum = np.sum(s)
    num_sv = 0
    # pdb.set_trace()
    for i in np.arange(len(s)) + 1:
        p = np.sum(s[:i])/ssum
        if p > perc:
            num_sv = i
            break
    # print num_sv, i, p
    S=np.diag(s[:num_sv])
    U=U[:,:num_sv]
    V=V[:num_sv,:num_sv]
    # print 'Apos redução com ' + str(p*100) + '% dos valores singulares'
    # print 'U=',U.shape
    # print 'S=',S.shape
    # print 'V=',V.shape
    O = np.dot(U,np.dot(S,V))
    # print 'Mreduced=',O.shape
    features=features[:O.shape[1]]

    return (features,O)


def pca(M,percent):
    """calcula o PCA e diminui a dimensão da matriz M contendo percent %
        dos principais componentes(eigenvalues)

    :M: Matriz onde os vetores de dados estao em linhas,
        features estão representadas em colunas
    :percent: porcentagem dos componentes a ser usado
    :returns: M reduzida

    """

    M = M.T

    perc = percent/100.0
    Rm = np.cov(M)
    eig_val,eig_vec = np.linalg.eig(Rm)
    # print 'Rm: ', Rm.shape
    # print 'eig_val: ', eig_val.shape
    # print 'eig_vec: ', eig_vec.shape

    eig_tuples = []
    eig_sum = 0
    for i in range(len(eig_val)):
        n = eig_val[i]
        eig_tuples.append((n,eig_vec[:,i]))
        eig_sum += n

    eig_tuples = sorted(eig_tuples)
    eig_tuples.reverse()

    # print 'eig_tuples:', len(eig_tuples)
    #select N% of components
    num_sv = 1
    cur_sum = 0
    # pdb.set_trace()
    for i in np.arange(len(eig_tuples)):
        cur_sum += eig_tuples[i][0]
        p = cur_sum/eig_sum
        if p > perc:
            num_sv = i+1
            break

    # print 'num_sv=',num_sv
    eig_tuples = eig_tuples[:num_sv]
    eig_vals = np.array([],dtype='float64')
    W = np.zeros(len(eig_tuples[0][1])).reshape(-1,1)
    for i in range(len(eig_tuples)):
        eigt = eig_tuples[i]
        np.append(eig_vals,eigt[0])
        W = np.hstack((W,eigt[1].reshape(-1,1)))

    W = W[:,1:]
    Mr = W.T.dot(M)
    Mr = Mr.T
    Mr = Mr.real
    # print 'W:',W.shape

    return Mr


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input_filename")
    parser.add_argument('-f',"--output-filename",
                        help="Name of the output file(default=reduced_features.csv)",
                        default='scatter_data.csv')
    parser.add_argument('-s', '--svd', action='store_true',
                        help="Use svd algorithm instead of pca")
    parser.add_argument('-p', '--percent', type=float,default=99.0,
                        help="Set the percent of component to select.(default=99.0)")
    args = parser.parse_args()

    main(**vars(args))

